import { useState, type FormEvent } from "react";
import { Zap } from "lucide-react";
import { toast } from "sonner";
import { GlassInput } from "@/components/glass/GlassInput";
import { GlassButton } from "@/components/glass/GlassButton";
import { RANGES, type VitalInput } from "@/lib/vitals";
import { createVital } from "@/lib/vitals-store";

type Fields = Record<keyof VitalInput, string>;

const EMPTY: Fields = {
  systolic: "",
  diastolic: "",
  heartRate: "",
  oxygen: "",
  temperature: "",
};

export function VitalForm({
  submitLabel = "Save My Vitals",
  onSaved,
}: {
  submitLabel?: string;
  onSaved?: (id: string) => void;
}) {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const set = (key: keyof Fields) => (e: { target: { value: string } }) =>
    setFields((f) => ({ ...f, [key]: e.target.value }));

  const invalid = (key: keyof Fields) => touched && fields[key].trim() === "";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched(true);

    const entries = Object.entries(fields) as [keyof Fields, string][];
    if (entries.some(([, v]) => v.trim() === "" || Number.isNaN(Number(v)))) {
      toast.error("Please fill in every reading with a number.");
      return;
    }

    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 900));
      const record = createVital({
        temperature: Number(fields.temperature),
        systolic: Number(fields.systolic),
        diastolic: Number(fields.diastolic),
        heartRate: Number(fields.heartRate),
        oxygen: Number(fields.oxygen),
      });
      setFields(EMPTY);
      setTouched(false);
      toast.success("Vitals analyzed and saved.");
      onSaved?.(record.id);
    } catch {
      toast.error("We couldn't analyze your vitals. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <GlassInput
          id="input-systolic"
          label="Systolic (mmHg)"
          hint={RANGES.systolic.hint}
          type="number"
          step="1"
          placeholder="120"
          value={fields.systolic}
          onChange={set("systolic")}
          invalid={invalid("systolic")}
        />
        <GlassInput
          id="input-diastolic"
          label="Diastolic (mmHg)"
          hint={RANGES.diastolic.hint}
          type="number"
          step="1"
          placeholder="80"
          value={fields.diastolic}
          onChange={set("diastolic")}
          invalid={invalid("diastolic")}
        />
      </div>
      <GlassInput
        id="input-heartrate"
        label="Heart Rate (bpm)"
        hint={RANGES.heartRate.hint}
        type="number"
        step="1"
        placeholder="72"
        value={fields.heartRate}
        onChange={set("heartRate")}
        invalid={invalid("heartRate")}
      />
      <GlassInput
        id="input-oxygen"
        label="Oxygen Saturation (%)"
        hint={RANGES.oxygen.hint}
        type="number"
        step="0.1"
        placeholder="98"
        value={fields.oxygen}
        onChange={set("oxygen")}
        invalid={invalid("oxygen")}
      />
      <GlassInput
        id="input-temperature"
        label="Temperature (°C)"
        hint={RANGES.temperature.hint}
        type="number"
        step="0.1"
        placeholder="36.5"
        value={fields.temperature}
        onChange={set("temperature")}
        invalid={invalid("temperature")}
      />

      <GlassButton type="submit" size="lg" loading={submitting} className="w-full">
        {!submitting && <Zap className="size-4" />}
        {submitting ? "Analyzing with AI…" : submitLabel}
      </GlassButton>
    </form>
  );
}
