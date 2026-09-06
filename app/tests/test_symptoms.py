"""Focused contract tests for symptom schemas."""

import pytest
from pydantic import ValidationError

from app.schemas.symptoms import SymptomAnalysisRequest, SymptomAnalysisResponse


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