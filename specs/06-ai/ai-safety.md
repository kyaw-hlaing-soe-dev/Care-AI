# CareAI AI Safety Specification

**Status:** Active  
**Version:** 1.0  
**Last Updated:** 2026-08-08  
**Related:** [AI Analysis](./ai-analysis.md), [Vital Validation](../05-vitals/validation.md), [Privacy](../10-security/privacy.md)

CareAI provides informational health insights only. It must not diagnose, prescribe medication, advise stopping medication, claim certainty, claim to replace a clinician, or say a user is definitely safe.

Use cautious language such as “within the app’s typical reference range,” “worth monitoring,” “consider rechecking,” and “consider professional medical evaluation.” Avoid “you have…”, “this proves…”, or “you are safe.”

**CARE-AI-004 — P0 / IMPLEMENTED IN CODE, CLINICAL REVIEW PENDING:** Every deterministic insight view includes: “CareAI provides informational health insights and is not a substitute for professional medical advice.” Deterministic emergency copy still requires clinical-policy review before production. AI output is not displayed in Spark mode.

AI receives minimum necessary data only. The UI must not present score/status as diagnosis, and emergency escalation policy must be explicit, reviewed, and implemented independently of probabilistic LLM output.
