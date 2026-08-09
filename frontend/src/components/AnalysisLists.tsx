import { CheckCircle2, AlertTriangle, Lightbulb } from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

type ListProps = { items: string[]; delay?: number | undefined };

function AnalysisList({
  items,
  title,
  Icon,
  tone,
  delay,
}: ListProps & { title: string; Icon: typeof CheckCircle2; tone: string }) {
  if (items.length === 0) return null;
  return (
    <GlassCard delay={delay} className="p-5">
      <h3 className={cn("inline-flex items-center gap-2 text-sm font-bold", tone)}>
        <Icon className="size-4" />
        {title}
      </h3>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5 text-sm text-foreground/85">
            <span className={cn("mt-[7px] size-1.5 shrink-0 rounded-full bg-current", tone)} />
            {item}
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}

export const GoodList = ({ items, delay }: ListProps) => {
  const { t } = useTranslation();
  return <AnalysisList items={items} delay={delay} title={t("dashboard.whatLooksGood")} Icon={CheckCircle2} tone="text-good-text" />;
};

export const ConcernsList = ({ items, delay }: ListProps) => {
  const { t } = useTranslation();
  return <AnalysisList items={items} delay={delay} title={t("dashboard.areasToWatch")} Icon={AlertTriangle} tone="text-warn-text" />;
};

export const RecommendationsList = ({ items, delay }: ListProps) => {
  const { t } = useTranslation();
  return <AnalysisList items={items} delay={delay} title={t("dashboard.recommendations")} Icon={Lightbulb} tone="text-info-text" />;
};
