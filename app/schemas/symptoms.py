"""Request and response models for the CareAI symptom analyzer."""

from typing import Dict, List, Literal, Optional

from pydantic import BaseModel, ConfigDict, Field, model_validator


Language = Literal["en", "my", "zh"]
TriageLevel = Literal["EMERGENCY", "URGENT", "SELF_CARE"]
UrgencyBadgeColor = Literal["red", "yellow", "green"]
Likelihood = Literal["Low", "Moderate", "High"]


class HealthConsideration(BaseModel):
    """A possible explanation presented as a non-diagnostic consideration."""

    model_config = ConfigDict(extra="forbid")

    condition: str = Field(
        ..., description="Name of a potential condition in the target language."
    )
    match_reason: str = Field(
        ..., description="Why the reported symptoms may align with this consideration."
    )
    likelihood: Likelihood = Field(
        ..., description="Relative likelihood: Low, Moderate, or High."
    )


class SymptomAnalysisRequest(BaseModel):
    """Validated symptom details sent to the protected AI provider."""

    model_config = ConfigDict(extra="forbid")

    symptoms_text: str = Field(
        ..., min_length=3, description="The user's symptom description."
    )
    duration_days: int = Field(
        1, ge=1, le=30, description="How long symptoms have been present, in days."
    )
    severity_score: int = Field(
        5, ge=1, le=10, description="Self-reported symptom severity from 1 to 10."
    )
    user_age: Optional[int] = Field(
        21, ge=1, le=120, description="User age in years, when available."
    )
    vitals_context: Optional[Dict[str, str]] = Field(
        None,
        description='Optional vital context, for example {"heart_rate": "88 bpm"}.',
    )
    language: Language = Field(
        "en", description="Response language: English, Burmese, or Simplified Chinese."
    )


class SymptomAnalysisResponse(BaseModel):
    """Strict, localized triage result returned by the symptom analyzer."""

    model_config = ConfigDict(extra="forbid")

    triage_level: TriageLevel = Field(..., description="Three-tier triage classification.")
    urgency_badge_color: UrgencyBadgeColor = Field(
        ..., description="UI badge color corresponding to the triage level."
    )
    summary_statement: str = Field(..., description="A concise, non-diagnostic summary.")
    possible_considerations: List[HealthConsideration] = Field(
        ..., description="Possible explanations, never definitive diagnoses."
    )
    recommended_actions: List[str] = Field(
        ..., description="Practical next steps appropriate to the triage level."
    )
    red_flag_warnings: List[str] = Field(
        ..., description="Emergency warning signs relevant to this presentation."
    )
    questions_for_doctor: List[str] = Field(
        ..., description="Questions the user may discuss with a clinician."
    )
    disclaimer: str = Field(..., description="Informational, non-medical-advice disclaimer.")

    @model_validator(mode="after")
    def validate_badge_matches_triage(self) -> "SymptomAnalysisResponse":
        """Prevent the model from returning a visually misleading urgency badge."""

        expected_colors = {
            "EMERGENCY": "red",
            "URGENT": "yellow",
            "SELF_CARE": "green",
        }
        if self.urgency_badge_color != expected_colors[self.triage_level]:
            raise ValueError("urgency_badge_color must match triage_level")
        return self