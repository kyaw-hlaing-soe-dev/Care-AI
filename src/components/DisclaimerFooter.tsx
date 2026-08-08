import { useTranslation } from "react-i18next";

export function DisclaimerFooter() {
  const { t } = useTranslation();
  return (
    <p className="mx-auto max-w-2xl px-4 py-8 text-center text-xs leading-relaxed text-muted-foreground">
      {t("medical.disclaimer")}
    </p>
  );
}
