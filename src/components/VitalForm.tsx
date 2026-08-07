import { useMemo, useRef, useState, type FormEvent } from "react";
import { Check, LoaderCircle, Zap } from "lucide-react";
import { toast } from "sonner";
import { GlassInput } from "@/components/glass/GlassInput";
import { RANGES, type VitalInput } from "@/lib/vitals";
import { createVital } from "@/lib/vitals-store";

type Fields = Record<keyof VitalInput, string>;
type FieldErrors = Partial<Record<keyof Fields, string>>;

const EMPTY: Fields = {
  systolic: "",
  diastolic: "",
  heartRate: "",
  oxygen: "",
  temperature: "",
};

const LIMITS: Record<keyof Fields, { min: number; max: number; empty: string; invalid: string }> = {
  systolic: { min: 50, max: 300, empty: "Enter a systolic pressure.", invalid: "Enter a valid systolic pressure." },
  diastolic: { min: 30, max: 200, empty: "Enter a diastolic pressure.", invalid: "Enter a valid diastolic pressure." },
  heartRate: { min: 20, max: 250, empty: "Enter a heart rate.", invalid: "Enter a valid heart rate." },
  oxygen: { min: 50, max: 100, empty: "Enter an oxygen saturation.", invalid: "Enter a valid oxygen saturation." },
  temperature: { min: 30, max: 45, empty: "Enter a temperature.", invalid: "Enter a valid temperature." },
};

function validate(fields: Fields): FieldErrors {
  const errors: FieldErrors = {};
  (Object.keys(fields) as Array<keyof Fields>).forEach((key) => {
    const value = fields[key].trim();
    const numeric = Number(value);
    const limit = LIMITS[key];
    if (!value) errors[key] = limit.empty;
    else if (!Number.isFinite(numeric) || numeric < limit.min || numeric > limit.max) {
      errors[key] = limit.invalid;
    }
  });
  return errors;
}

const referenceHint = (hint: string) => hint.replace(/^Normal:/, "Typical reference:");

export function VitalForm({ onSaved }: { onSaved?: (id: string) => void }) {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const submitLock = useRef(false);
  const errors = useMemo(() => validate(fields), [fields]);

  function update(key: keyof Fields, value: string) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  function markTouched(key: keyof Fields) {
    setTouched((current) => ({ ...current, [key]: true }));
  }

  function visibleError(key: keyof Fields) {
    return touched[key] || hasSubmitted ? errors[key] : undefined;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitLock.current) return;

    setHasSubmitted(true);
    if (Object.keys(errors).length > 0) {
      const firstInvalid = Object.keys(errors)[0];
      if (firstInvalid) {
        window.requestAnimationFrame(() => document.getElementById(`input-${firstInvalid}`)?.focus());
      }
      return;
    }

    submitLock.current = true;
    setSubmitting(true);
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 700));
      const record = createVital({
        temperature: Number(fields.temperature),
        systolic: Number(fields.systolic),
        diastolic: Number(fields.diastolic),
        heartRate: Number(fields.heartRate),
        oxygen: Number(fields.oxygen),
      });
      setSaved(true);
      toast.success("Reading analyzed and saved.");
      await new Promise((resolve) => window.setTimeout(resolve, 650));
      onSaved?.(record.id);
    } catch {
      submitLock.current = false;
      setSubmitting(false);
      toast.error("We couldn't analyze your vitals. Please try again.");
    }
  }

  if (saved) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center px-4 text-center" role="status" aria-live="polite">
        <span className="grid size-16 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-[0_18px_42px_rgba(37,99,235,0.22)]">
          <Check className="size-7" strokeWidth={2.5} aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-2xl font-extrabold tracking-[-0.035em] text-slate-950">Reading saved</h2>
        <p className="mt-2 text-sm text-slate-500">Your CareAI overview is being updated.</p>
      </div>
    );
  }

  return (
    <form onSubmit={(event) => void handleSubmit(event)} className="space-y-7" noValidate>
      <fieldset>
        <legend className="text-xs font-extrabold uppercase tracking-[0.14em] text-blue-600">Blood pressure</legend>
        <p className="mt-1 text-sm leading-6 text-slate-500">Enter both values from the same measurement.</p>
        <div className="mt-4 grid grid-cols-1 gap-4 min-[375px]:grid-cols-2">
          <GlassInput
            id="input-systolic"
            label="Systolic"
            hint={referenceHint(RANGES.systolic.hint)}
            error={visibleError("systolic")}
            unit="mmHg"
            type="number"
            inputMode="numeric"
            step="1"
            placeholder="120"
            value={fields.systolic}
            onChange={(event) => update("systolic", event.target.value)}
            onBlur={() => markTouched("systolic")}
          />
          <GlassInput
            id="input-diastolic"
            label="Diastolic"
            hint={referenceHint(RANGES.diastolic.hint)}
            error={visibleError("diastolic")}
            unit="mmHg"
            type="number"
            inputMode="numeric"
            step="1"
            placeholder="80"
            value={fields.diastolic}
            onChange={(event) => update("diastolic", event.target.value)}
            onBlur={() => markTouched("diastolic")}
          />
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-xs font-extrabold uppercase tracking-[0.14em] text-blue-600">Other vitals</legend>
        <div className="mt-4 grid gap-4">
          <GlassInput
            id="input-heartRate"
            label="Heart Rate"
            hint={referenceHint(RANGES.heartRate.hint)}
            error={visibleError("heartRate")}
            unit="bpm"
            type="number"
            inputMode="numeric"
            step="1"
            placeholder="72"
            value={fields.heartRate}
            onChange={(event) => update("heartRate", event.target.value)}
            onBlur={() => markTouched("heartRate")}
          />
          <GlassInput
            id="input-oxygen"
            label="Oxygen Saturation"
            hint={referenceHint(RANGES.oxygen.hint)}
            error={visibleError("oxygen")}
            unit="%"
            type="number"
            inputMode="decimal"
            step="0.1"
            placeholder="98"
            value={fields.oxygen}
            onChange={(event) => update("oxygen", event.target.value)}
            onBlur={() => markTouched("oxygen")}
          />
          <GlassInput
            id="input-temperature"
            label="Temperature"
            hint={referenceHint(RANGES.temperature.hint)}
            error={visibleError("temperature")}
            unit="°C"
            type="number"
            inputMode="decimal"
            step="0.1"
            placeholder="36.5"
            value={fields.temperature}
            onChange={(event) => update("temperature", event.target.value)}
            onBlur={() => markTouched("temperature")}
          />
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={submitting}
        aria-busy={submitting}
        className="flex h-14 w-full items-center justify-center gap-2 rounded-[15px] bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 px-5 text-[15px] font-bold text-white shadow-[0_14px_32px_rgba(37,99,235,0.24)] transition-[transform,box-shadow,filter] duration-200 hover:-translate-y-px hover:brightness-[1.02] hover:shadow-[0_18px_38px_rgba(37,99,235,0.30)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-75 motion-reduce:transform-none motion-reduce:transition-none"
      >
        {submitting ? (
          <>
            <LoaderCircle className="size-5 animate-spin motion-reduce:animate-none" aria-hidden="true" />
            Analyzing...
          </>
        ) : (
          <>
            <Zap className="size-4" aria-hidden="true" />
            Analyze My Vitals
          </>
        )}
      </button>
    </form>
  );
}
