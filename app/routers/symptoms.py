"""Gemini-backed symptom analysis endpoint."""

import json
import os
from typing import Any, Final

import google.generativeai as genai
from fastapi import APIRouter, HTTPException, status
from pydantic import ValidationError

from app.schemas.symptoms import SymptomAnalysisRequest, SymptomAnalysisResponse


router = APIRouter(prefix="/api/care-ai", tags=["Symptom Analyzer"])

MODEL_NAME: Final[str] = "gemini-2.5-flash"
LANGUAGE_NAMES: Final[dict[str, str]] = {
    "en": "English",
    "my": "Burmese",
    "zh": "Simplified Chinese",
}

SYSTEM_PROMPT: Final[str] = """
You are CareAI's cautious symptom-triage assistant. You provide informational guidance,
not diagnoses, prescriptions, or certainty. Use probabilistic language such as
\"Considerations may include...\" and never say that the user definitely has or does not
have a condition.

Patient safety comes first: check for chest pain, acute shortness of breath, and stroke
symptoms (face drooping, arm weakness, speech difficulty) immediately. Treat those signs,
severe allergic reaction, uncontrolled bleeding, loss of consciousness, or other
life-threatening symptoms as EMERGENCY and recommend contacting local emergency services.
Use URGENT for symptoms needing prompt professional assessment and SELF_CARE only when
home monitoring is reasonable with clear escalation advice.

Return ONLY valid JSON matching exactly this structure and no Markdown:
{
  \"triage_level\": \"EMERGENCY|URGENT|SELF_CARE\",
  \"urgency_badge_color\": \"red|yellow|green\",
  \"summary_statement\": \"string\",
  \"possible_considerations\": [{\"condition\": \"string\", \"match_reason\": \"string\", \"likelihood\": \"Low|Moderate|High\"}],
  \"recommended_actions\": [\"string\"],
  \"red_flag_warnings\": [\"string\"],
  \"questions_for_doctor\": [\"string\"],
  \"disclaimer\": \"string\"
}
The badge color must be red for EMERGENCY, yellow for URGENT, and green for SELF_CARE.
""".strip()


def _build_user_prompt(request: SymptomAnalysisRequest) -> str:
    """Build a minimal provider prompt without identity or unrelated profile data."""

    return json.dumps(
        {
            "target_language": LANGUAGE_NAMES[request.language],
            "symptoms_text": request.symptoms_text,
            "duration_days": request.duration_days,
            "severity_score": request.severity_score,
            "user_age": request.user_age,
            "vitals_context": request.vitals_context,
        },
        ensure_ascii=False,
    )


@router.post(
    "/analyze-symptoms",
    response_model=SymptomAnalysisResponse,
    status_code=status.HTTP_200_OK,
    summary="Analyze symptoms with a three-tier safety triage",
)
def analyze_symptoms(request: SymptomAnalysisRequest) -> SymptomAnalysisResponse:
    """Analyze symptoms through Gemini and validate its response before returning it."""

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Symptom analysis is temporarily unavailable: GEMINI_API_KEY is not configured.",
        )

    try:
        # Native JSON mode reduces formatting ambiguity; Pydantic remains the final contract gate.
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel(
            model_name=MODEL_NAME,
            system_instruction=SYSTEM_PROMPT,
        )
        response: Any = model.generate_content(
            _build_user_prompt(request),
            generation_config={"response_mime_type": "application/json"},
        )
        raw_text = response.text
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="The symptom analysis provider could not be reached.",
        ) from exc

    try:
        payload = json.loads(raw_text)
        return SymptomAnalysisResponse.model_validate(payload)
    except (json.JSONDecodeError, TypeError, ValidationError) as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="The symptom analysis provider returned an invalid response.",
        ) from exc