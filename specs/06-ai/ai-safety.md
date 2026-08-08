# CareAI AI Safety Specification

**Status:** Active  
**Version:** 1.0  
**Last Updated:** 2026-08-08  
**Related:** [AI Analysis](./ai-analysis.md), [Vital Validation](../05-vitals/validation.md), [Privacy](../10-security/privacy.md)

CareAI provides informational health insights only. It must not diagnose, prescribe medication, advise stopping medication, claim certainty, claim to replace a clinician, or say a user is definitely safe.

Use cautious language such as “within the app’s typical reference range,” “worth monitoring,” “consider rechecking,” and “consider professional medical evaluation.” Avoid “you have…”, “this proves…”, or “you are safe.”

**CARE-AI-004 — P0 / PARTIAL:** Every insight view must include or link to: “CareAI provides informational health insights and is not a substitute for professional medical advice.” Current local emergency copy is more directive than the target safety contract and requires clinical-policy review before production.

AI receives minimum necessary data only. The UI must not present score/status as diagnosis, and emergency escalation policy must be explicit, reviewed, and implemented independently of probabilistic LLM output.
