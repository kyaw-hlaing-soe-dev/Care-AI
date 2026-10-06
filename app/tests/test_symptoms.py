"""Focused contract tests for symptom schemas."""

import json
from types import SimpleNamespace

import pytest
from pydantic import ValidationError

from app.schemas.symptoms import (
    SeniorAnalysisRequest,
    SeniorAnalysisResponse,
    SymptomAnalysisRequest,
    SymptomAnalysisResponse,
)
from app.services import triage_engine


def test_request_defaults_and_language_validation() -> None:
    request = SymptomAnalysisRequest(symptoms_text="Headache")

    assert request.duration_days == 1
    assert request.severity_score == 5
    assert request.language == "en"


def test_request_rejects_out_of_range_values() -> None:
    with pytest.raises(ValidationError):
        SymptomAnalysisRequest(symptoms_text="Hi", severity_score=11)


def test_response_rejects_mismatched_badge_color() -> None:
    with pytest.raises(ValidationError):
        SymptomAnalysisResponse(
            triage_level="EMERGENCY",
            urgency_badge_color="green",
            summary_statement="Seek emergency care.",
            possible_considerations=[],
            recommended_actions=[],
            red_flag_warnings=[],
            questions_for_doctor=[],
            disclaimer="Informational only.",
        )


def test_senior_request_requires_symptom_choices_and_valid_severity() -> None:
    request = SeniorAnalysisRequest(
        body_parts=["Knees"],
        pain_sensations=["Dull ache"],
        pain_severity=5,
        duration="2–3 days",
        gender="Other / Prefer not to say",
    )

    assert request.age is None

    with pytest.raises(ValidationError):
        SeniorAnalysisRequest(
            body_parts=[],
            pain_sensations=["Dull ache"],
            pain_severity=5,
            duration="2–3 days",
            gender="Other / Prefer not to say",
        )

    with pytest.raises(ValidationError):
        SeniorAnalysisRequest(
            body_parts=["Knees"],
            pain_sensations=["Dull ache"],
            pain_severity=11,
            duration="2–3 days",
            gender="Other / Prefer not to say",
        )


def test_senior_response_requires_matching_urgency_color() -> None:
    with pytest.raises(ValidationError):
        SeniorAnalysisResponse(
            urgency="Seek immediate attention",
            urgency_badge_color="green",
            summary="Please seek urgent medical care.",
            possible_conditions=[],
            red_flags=["Trouble breathing"],
            recommended_actions=["Contact local emergency services."],
        )


def test_senior_analysis_uses_gemini_and_normalizes_badge(monkeypatch: pytest.MonkeyPatch) -> None:
    captured: dict[str, object] = {}

    class FakeModels:
        def generate_content(self, **kwargs: object) -> SimpleNamespace:
            captured.update(kwargs)
            return SimpleNamespace(
                parsed={
                    "urgency": "Routine",
                    "urgency_badge_color": "red",
                    "summary": "Consider monitoring how you feel.",
                    "possible_conditions": [],
                    "red_flags": ["Trouble breathing"],
                    "recommended_actions": ["Contact a health professional if symptoms persist."],
                }
            )

    class FakeClient:
        def __init__(self, api_key: str | None) -> None:
            assert api_key == "test-key"
            self.models = FakeModels()

    monkeypatch.setenv("GEMINI_API_KEY", "test-key")
    monkeypatch.setattr(triage_engine.genai, "Client", FakeClient)
    request = SeniorAnalysisRequest(
        body_parts=["Knees"],
        pain_sensations=["Dull ache"],
        pain_severity=3,
        duration="Just started today",
        gender="Other / Prefer not to say",
    )

    result = triage_engine.analyze_senior_symptoms(request)

    assert result.urgency_badge_color == "green"
    assert captured["model"] == "gemini-2.5-flash"
    assert json.loads(str(captured["contents"]))["age"] is None
    assert captured["config"].temperature == 0.2  # type: ignore[union-attr]