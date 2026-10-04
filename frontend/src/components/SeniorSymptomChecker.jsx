import { useEffect, useRef, useState } from "react";
import {
  Activity,
  Check,
  Clock,
  HeartPulse,
  Info,
  LoaderCircle,
  MapPin,
  ShieldAlert,
  Thermometer,
  User,
} from "lucide-react";

const BODY_PARTS = [
  "Head",
  "Chest",
  "Lower Back",
  "Knees",
  "Stomach",
  "Neck",
  "Shoulders",
  "Hands/Wrists",
  "Legs/Ankles",
];

const PAIN_SENSATIONS = [
  "Dull ache",
  "Sharp / Stabbing",
  "Throbbing",
  "Burning",
  "Tingling / Numbness",
  "Cramping",
];

const DURATIONS = [
  "Just started today",
  "2–3 days",
  "About a week",
  "A few weeks",
  "Months or longer",
];

const GENDERS = ["Female", "Male", "Other / Prefer not to say"];

const URGENCY_COLORS = {
  Routine: "green",
  "See a doctor soon": "yellow",
  "Seek immediate attention": "red",
};

const BADGE_STYLES = {
  green: "border-emerald-200 bg-emerald-50 text-emerald-900",
  yellow: "border-amber-300 bg-amber-50 text-amber-950",
  red: "border-red-300 bg-red-50 text-red-900",
};

const MEDICAL_DISCLAIMER =
  "CareAI provides informational health insights and is not a substitute for professional medical advice.";

const GENERAL_RED_FLAGS = [
  "Chest pain or pressure, especially with sweating or nausea",
  "Trouble breathing or sudden severe weakness",
  "Sudden face drooping, arm weakness, or trouble speaking",
  "Fainting, loss of consciousness, or severe bleeding",
];

function TogglePill({ label, selected, onClick }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`inline-flex min-h-[56px] items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-[17px] font-semibold leading-6 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 ${
        selected
          ? "border-blue-700 bg-blue-700 text-white shadow-sm"
          : "border-blue-100 bg-white text-slate-800 hover:border-blue-300 hover:bg-blue-50"
      }`}
    >
      {selected ? <Check className="size-5 shrink-0" aria-hidden="true" /> : null}
      {label}
    </button>
  );
}

function QuestionCard({ icon: Icon, title, helper, children, id }) {
  return (
    <fieldset
      aria-describedby={helper ? `${id}-helper` : undefined}
      className="rounded-3xl border border-blue-100/80 bg-white p-5 shadow-[0_12px_35px_rgba(41,89,145,0.07)] sm:p-7"
    >
      <legend className="sr-only">{title}</legend>
      <div className="mb-5 flex items-start gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-700">
          <Icon className="size-6" aria-hidden="true" />
        </span>
        <div className="pt-0.5">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{title}</h2>
          {helper ? (
            <p id={`${id}-helper`} className="mt-1 text-base leading-6 text-slate-700">
              {helper}
            </p>
          ) : null}
        </div>
      </div>
      {children}
    </fieldset>
  );
}

function validateResponse(payload) {
  if (payload == null || typeof payload !== "object") return null;
  const expectedColor = URGENCY_COLORS[payload.urgency];
  if (
    !expectedColor ||
    payload.urgency_badge_color !== expectedColor ||
    typeof payload.summary !== "string" ||
    !Array.isArray(payload.possible_conditions) ||
    !payload.possible_conditions.every(
      (condition) =>
        condition &&
        typeof condition.name === "string" &&
        typeof condition.explanation === "string",
    ) ||
    !Array.isArray(payload.red_flags) ||
    !payload.red_flags.every((item) => typeof item === "string") ||
    !Array.isArray(payload.recommended_actions) ||
    !payload.recommended_actions.every((item) => typeof item === "string")
  ) {
    return null;
  }
  return payload;
}

export default function SeniorSymptomChecker() {
  const [bodyParts, setBodyParts] = useState([]);
  const [painSensations, setPainSensations] = useState([]);
  const [painSeverity, setPainSeverity] = useState(null);
  const [duration, setDuration] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const dialogRef = useRef(null);

  const ageIsValid =
    age === "" || (/^\d+$/.test(age) && Number(age) >= 1 && Number(age) <= 120);
  const formComplete =
    bodyParts.length > 0 &&
    painSensations.length > 0 &&
    painSeverity !== null &&
    duration &&
    gender &&
    ageIsValid;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (dialogOpen && !dialog.open) dialog.showModal();
    if (!dialogOpen && dialog.open) dialog.close();
  }, [dialogOpen]);

  function toggleChoice(value, values, setValues) {
    setValues(
      values.includes(value) ? values.filter((item) => item !== value) : [...values, value],
    );
  }

  async function handleAnalyze(event) {
    event.preventDefault();
    if (!formComplete || loading) return;

    setResult(null);
    setError("");
    setLoading(true);
    setDialogOpen(true);

    try {
      const response = await fetch("/api/symptoms/analyze-senior", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body_parts: bodyParts,
          pain_sensations: painSensations,
          pain_severity: painSeverity,
          duration,
          gender,
          ...(age ? { age: Number(age) } : {}),
        }),
      });

      if (!response.ok) throw new Error("CareAI could not complete the analysis right now.");
      const payload = validateResponse(await response.json());
      if (!payload) throw new Error("CareAI returned an incomplete result. Please try again.");
      setResult(payload);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "CareAI could not complete the analysis right now.",
      );
    } finally {
      setLoading(false);
    }
  }

  function closeDialog() {
    setDialogOpen(false);
  }

  const redFlags = result?.red_flags.length ? result.red_flags : GENERAL_RED_FLAGS;

  return (
    <main className="min-h-[calc(100dvh-5rem)] bg-[radial-gradient(ellipse_at_top,_#dcecff_0%,_#f0f6ff_42%,_#ffffff_100%)] px-4 pb-48 pt-8 sm:px-6 sm:pt-12">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 text-center sm:mb-10">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/90 px-4 py-2 text-base font-bold text-blue-800 shadow-sm">
            <HeartPulse className="size-5" aria-hidden="true" />
            CareAI Symptom Check
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Let’s understand how you’re feeling
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-lg leading-7 text-slate-700">
            Answer a few simple questions. Your answers help us offer clear, informational next steps.
          </p>
        </header>

        <form onSubmit={handleAnalyze} className="space-y-5 sm:space-y-6">
          <QuestionCard
            id="body-parts"
            icon={MapPin}
            title="Where does it hurt?"
            helper="Choose all the areas that feel uncomfortable."
          >
            <div className="flex flex-wrap gap-3">
              {BODY_PARTS.map((part) => (
                <TogglePill
                  key={part}
                  label={part}
                  selected={bodyParts.includes(part)}
                  onClick={() => toggleChoice(part, bodyParts, setBodyParts)}
                />
              ))}
            </div>
          </QuestionCard>

          <QuestionCard
            id="pain-sensations"
            icon={Activity}
            title="How does the pain feel?"
            helper="Choose every word that describes how it feels."
          >
            <div className="flex flex-wrap gap-3">
              {PAIN_SENSATIONS.map((sensation) => (
                <TogglePill
                  key={sensation}
                  label={sensation}
                  selected={painSensations.includes(sensation)}
                  onClick={() => toggleChoice(sensation, painSensations, setPainSensations)}
                />
              ))}
            </div>
          </QuestionCard>

          <QuestionCard
            id="pain-severity"
            icon={Thermometer}
            title="How strong is the pain?"
            helper="Pick the number that best matches how you feel right now."
          >
            <div className="grid grid-cols-5 gap-2 sm:grid-cols-10 sm:gap-3" role="group" aria-label="Pain strength from 1 to 10">
              {Array.from({ length: 10 }, (_, index) => index + 1).map((level) => (
                <button
                  key={level}
                  type="button"
                  aria-label={`Pain level ${level}${level === 1 ? ", mild" : level === 5 ? ", moderate" : level === 10 ? ", severe" : ""}`}
                  aria-pressed={painSeverity === level}
                  onClick={() => setPainSeverity(level)}
                  className={`min-h-[58px] rounded-2xl border text-lg font-bold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 ${
                    painSeverity === level
                      ? "border-blue-700 bg-blue-700 text-white shadow-md"
                      : "border-blue-100 bg-white text-slate-800 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <div className="mt-4 flex justify-between gap-3 text-sm font-semibold text-slate-700 sm:text-base">
              <span>Mild (1)</span>
              <span className="text-center">Moderate (5)</span>
              <span className="text-right">Severe (10)</span>
            </div>
          </QuestionCard>

          <QuestionCard
            id="duration"
            icon={Clock}
            title="How long has it been hurting?"
            helper="Choose the closest answer."
          >
            <div className="flex flex-wrap gap-3" role="group" aria-label="How long the pain has lasted">
              {DURATIONS.map((choice) => (
                <TogglePill
                  key={choice}
                  label={choice}
                  selected={duration === choice}
                  onClick={() => setDuration(choice)}
                />
              ))}
            </div>
          </QuestionCard>

          <QuestionCard
            id="about-you"
            icon={User}
            title="A little about you"
            helper="These details are optional except for the gender choice. Age is optional."
          >
            <p className="mb-3 text-base font-semibold text-slate-800">Gender</p>
            <div className="flex flex-wrap gap-3" role="group" aria-label="Gender">
              {GENDERS.map((choice) => (
                <TogglePill
                  key={choice}
                  label={choice}
                  selected={gender === choice}
                  onClick={() => setGender(choice)}
                />
              ))}
            </div>
            <div className="mt-6 max-w-xs">
              <label htmlFor="senior-age" className="mb-2 block text-base font-semibold text-slate-800">
                Age <span className="font-normal text-slate-600">(optional)</span>
              </label>
              <input
                id="senior-age"
                type="number"
                inputMode="numeric"
                min="1"
                max="120"
                step="1"
                value={age}
                onChange={(event) => setAge(event.target.value)}
                aria-invalid={!ageIsValid}
                aria-describedby={!ageIsValid ? "senior-age-error" : undefined}
                placeholder="For example, 72"
                className="min-h-[56px] w-full rounded-2xl border border-blue-200 bg-white px-4 text-lg text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              />
              {!ageIsValid ? (
                <p id="senior-age-error" className="mt-2 text-base font-medium text-red-800" role="alert">
                  Enter an age from 1 to 120, or leave this field blank.
                </p>
              ) : null}
            </div>
          </QuestionCard>

          {!formComplete ? (
            <p className="px-1 text-base leading-6 text-slate-700" aria-live="polite">
              To continue, choose at least one area and pain feeling, then select pain strength,
              duration, and a gender option.
            </p>
          ) : null}

          <section className="rounded-3xl border border-blue-100 bg-white/90 p-5 text-base leading-7 text-slate-700 shadow-sm sm:p-6" aria-label="Important health information">
            <div className="flex items-start gap-3">
              <Info className="mt-1 size-5 shrink-0 text-blue-700" aria-hidden="true" />
              <p>{MEDICAL_DISCLAIMER}</p>
            </div>
          </section>

          <div className="fixed inset-x-0 bottom-[calc(5.75rem+env(safe-area-inset-bottom))] z-40 px-3 md:bottom-4">
            <div className="mx-auto flex max-w-4xl items-center gap-4 rounded-3xl border border-blue-100 bg-white/95 p-3 shadow-[0_12px_36px_rgba(31,72,116,0.18)] backdrop-blur sm:p-4">
              <p className="hidden flex-1 text-base leading-6 text-slate-700 sm:block">
                Your answers are used to prepare this informational summary.
              </p>
              <button
                type="submit"
                disabled={!formComplete || loading}
                className="inline-flex min-h-[58px] w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-3 text-lg font-bold text-white shadow-md transition hover:from-blue-800 hover:to-indigo-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-500 sm:w-auto sm:min-w-72"
              >
                <HeartPulse className="size-5" aria-hidden="true" />
                Analyze my symptoms
              </button>
            </div>
          </div>
        </form>
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby="senior-results-title"
        aria-modal="true"
        onCancel={(event) => {
          if (loading) event.preventDefault();
          else setDialogOpen(false);
        }}
        onClose={() => setDialogOpen(false)}
        className="fixed inset-0 m-0 h-dvh w-screen max-h-none max-w-none overflow-hidden border-0 bg-transparent p-0 text-slate-900 backdrop:bg-slate-950/55 backdrop:backdrop-blur-sm"
      >
        <div className="grid h-full min-h-0 place-items-center sm:p-5">
          <div className="flex h-full max-h-full w-full max-w-3xl flex-col overflow-hidden bg-[#f8fbff] shadow-2xl sm:rounded-3xl">
            <header className="flex shrink-0 items-center justify-between gap-4 border-b border-blue-100 bg-white px-5 py-4 sm:px-7">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-2xl bg-blue-50 text-blue-700">
                  <HeartPulse className="size-6" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-blue-700">CareAI</p>
                  <h2 id="senior-results-title" className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                    Your symptom summary
                  </h2>
                </div>
              </div>
              {!loading && !error ? (
                <span className="sr-only">Analysis complete</span>
              ) : null}
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8" aria-live="polite" aria-busy={loading}>
              {loading ? (
                <div className="flex min-h-[55dvh] flex-col items-center justify-center text-center">
                  <span className="mb-6 grid size-20 place-items-center rounded-full bg-blue-100 text-blue-700">
                    <LoaderCircle className="size-11 animate-spin motion-reduce:animate-none" aria-hidden="true" />
                  </span>
                  <p className="text-xl font-bold text-slate-900 sm:text-2xl">
                    Analyzing your symptoms with CareAI...
                  </p>
                  <p className="mt-3 max-w-md text-lg leading-7 text-slate-700">
                    This may take a moment. Please keep this window open.
                  </p>
                </div>
              ) : error ? (
                <div className="mx-auto flex min-h-[50dvh] max-w-xl flex-col items-center justify-center text-center">
                  <span className="grid size-16 place-items-center rounded-full bg-amber-100 text-amber-800">
                    <Info className="size-8" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-2xl font-bold text-slate-900">We couldn’t finish the analysis</h3>
                  <p className="mt-3 text-lg leading-7 text-slate-700">{error}</p>
                  <p className="mt-4 text-base leading-6 text-slate-700">If you may be having an emergency, contact local emergency services now.</p>
                </div>
              ) : result ? (
                <div className="space-y-6">
                  <div className={`inline-flex min-h-12 items-center gap-2 rounded-full border px-5 py-2 text-base font-extrabold ${BADGE_STYLES[result.urgency_badge_color]}`}>
                    <Activity className="size-5" aria-hidden="true" />
                    {result.urgency}
                  </div>

                  <section className="rounded-3xl border border-blue-100 bg-white p-5 shadow-sm sm:p-6">
                    <h3 className="text-xl font-bold text-slate-900">Overview</h3>
                    <p className="mt-3 text-lg leading-8 text-slate-800">{result.summary}</p>
                  </section>

                  <section className="rounded-3xl border border-blue-100 bg-white p-5 shadow-sm sm:p-6">
                    <h3 className="text-xl font-bold text-slate-900">Possible explanations</h3>
                    {result.possible_conditions.length ? (
                      <ul className="mt-4 space-y-4">
                        {result.possible_conditions.map((condition, index) => (
                          <li key={`${condition.name}-${index}`} className="border-l-4 border-blue-300 pl-4">
                            <p className="text-lg font-bold text-slate-900">{condition.name}</p>
                            <p className="mt-1 text-base leading-7 text-slate-700">{condition.explanation}</p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-3 text-base leading-7 text-slate-700">No specific explanations were included in this summary.</p>
                    )}
                  </section>

                  <section className="rounded-3xl border-2 border-red-300 bg-red-50 p-5 shadow-sm sm:p-6" aria-labelledby="red-flags-title">
                    <div className="flex items-start gap-3">
                      <ShieldAlert className="mt-0.5 size-7 shrink-0 text-red-800" aria-hidden="true" />
                      <div>
                        <h3 id="red-flags-title" className="text-xl font-extrabold text-red-950">
                          Red Flag Warning Signs
                        </h3>
                        <p className="mt-2 text-base font-semibold leading-7 text-red-950">
                          Get urgent medical help if you experience any of these signs:
                        </p>
                        <ul className="mt-3 list-disc space-y-2 pl-6 text-base leading-7 text-red-950">
                          {redFlags.map((flag, index) => <li key={`${flag}-${index}`}>{flag}</li>)}
                        </ul>
                      </div>
                    </div>
                  </section>

                  <section className="rounded-3xl border border-blue-100 bg-white p-5 shadow-sm sm:p-6">
                    <h3 className="text-xl font-bold text-slate-900">What you can do next</h3>
                    {result.recommended_actions.length ? (
                      <ul className="mt-3 list-disc space-y-2 pl-6 text-base leading-7 text-slate-800">
                        {result.recommended_actions.map((action, index) => <li key={`${action}-${index}`}>{action}</li>)}
                      </ul>
                    ) : (
                      <p className="mt-3 text-base leading-7 text-slate-700">Consider speaking with a health professional about your symptoms.</p>
                    )}
                  </section>

                  <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-base font-medium leading-7 text-amber-950">
                    <Info className="mr-2 inline size-5 align-[-3px]" aria-hidden="true" />
                    {MEDICAL_DISCLAIMER}
                  </p>
                </div>
              ) : null}
            </div>

            {!loading ? (
              <footer className="shrink-0 border-t border-blue-100 bg-white px-5 py-4 sm:px-7">
                <button
                  type="button"
                  onClick={closeDialog}
                  className="min-h-[56px] w-full rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-3 text-lg font-bold text-white shadow-md transition hover:from-blue-800 hover:to-indigo-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300"
                >
                  Edit my answers
                </button>
              </footer>
            ) : null}
          </div>
        </div>
      </dialog>
    </main>
  );
}
