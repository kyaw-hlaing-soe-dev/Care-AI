import { useMemo, useRef, useState, type FormEvent } from "react";
import { Check, LoaderCircle, Zap } from "lucide-react";
import { toast } from "sonner";
import { GlassInput } from "@/components/glass/GlassInput";
import { RANGES, type VitalInput } from "@/lib/vitals";
import { createVital } from "@/lib/vitals-store";
import { useTranslation } from "react-i18next";

type Fields = Record<keyof VitalInput, string>;
type FieldErrors = Partial<Record<keyof Fields, string>>;

const EMPTY: Fields = {
  systolic: "",
  diastolic: "",
  heartRate: "",
  oxygen: "",
  temperature: "",
};

const LIMITS: Record<keyof Fields, { min: number; max: number }> = {
  systolic: { min: 50, max: 300 },
  diastolic: { min: 30, max: 200 },
  heartRate: { min: 20, max: 250 },
  oxygen: { min: 50, max: 100 },
  temperature: { min: 30, max: 45 },
};

const VALIDATION_KEYS: Record<keyof Fields, `validation.${string}`> = {
  systolic: "validation.systolic", diastolic: "validation.diastolic", heartRate: "validation.heartRate",
  oxygen: "validation.oxygen", temperature: "validation.temperature",
};

function validate(fields: Fields, translate: (key: string) => string): FieldErrors {
  const errors: FieldErrors = {};
  (Object.keys(fields) as Array<keyof Fields>).forEach((key) => {
    const value = fields[key].trim();
    const numeric = Number(value);
    const limit = LIMITS[key];
    if (!value) errors[key] = translate(VALIDATION_KEYS[key]);
    else if (!Number.isFinite(numeric) || numeric < limit.min || numeric > limit.max) {
      errors[key] = translate(VALIDATION_KEYS[key]);
    }
  });
  return errors;
}

export function VitalForm({ onSaved }: { onSaved?: (id: string) => void }) {
  const { t } = useTranslation();
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const submitLock = useRef(false);
  const errors = useMemo(() => validate(fields, t), [fields, t]);
  const referenceHint = (key: keyof typeof RANGES) => {
    const range = RANGES[key];
    return t("vitals.typical", { range: `${range.min} – ${range.max}${range.unit}` });
  };

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
      toast.success(t("vitals.analyzed"));
      await new Promise((resolve) => window.setTimeout(resolve, 650));
      onSaved?.(record.id);
    } catch {
      submitLock.current = false;
      setSubmitting(false);
      toast.error(t("vitals.analysisFailed"));
    }
  }

  if (saved) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center px-4 text-center" role="status" aria-live="polite">
        <span className="grid size-16 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-[0_18px_42px_rgba(37,99,235,0.22)]">
          <Check className="size-7" strokeWidth={2.5} aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-2xl font-extrabold tracking-[-0.035em] text-slate-950">{t("vitals.analyzed")}</h2>
        <p className="mt-2 text-sm text-slate-500">{t("dashboard.subtitle")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={(event) => void handleSubmit(event)} className="space-y-7" noValidate>
      <fieldset>
        <legend className="text-xs font-extrabold uppercase tracking-[0.14em] text-blue-600">{t("vitals.bloodPressure")}</legend>
        <p className="mt-1 text-sm leading-6 text-slate-500">{t("vitals.bloodPressureBody")}</p>
        <div className="mt-4 grid grid-cols-1 gap-4 min-[375px]:grid-cols-2">
          <GlassInput
            id="input-systolic"
            label={t("vitals.systolic")}
            hint={referenceHint("systolic")}
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
            label={t("vitals.diastolic")}
            hint={referenceHint("diastolic")}
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
        <legend className="text-xs font-extrabold uppercase tracking-[0.14em] text-blue-600">{t("vitals.otherVitals")}</legend>
        <div className="mt-4 grid gap-4">
          <GlassInput
            id="input-heartRate"
            label={t("vitals.heartRate")}
            hint={referenceHint("heartRate")}
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
            label={t("vitals.oxygen")}
            hint={referenceHint("oxygen")}
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
            label={t("vitals.temperature")}
            hint={referenceHint("temperature")}
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
            {t("vitals.analyzing")}
          </>
        ) : (
          <>
            <Zap className="size-4" aria-hidden="true" />
            {t("vitals.analyze")}
          </>
        )}
      </button>
    </form>
  );
}
