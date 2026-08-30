import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const languages = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
  { code: "ar", label: "AR" },
] as const;

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const current = (i18n.language?.split("-")[0] as typeof languages[number]["code"]) ?? "en";

  function handleChange(value: string | null) {
    if (value) void i18n.changeLanguage(value);
  }

  return (
    <Select value={current} onValueChange={handleChange}>
      <SelectTrigger
        aria-label={t("language.select", { defaultValue: "Select language" })}
        className="h-9 w-[72px] gap-1.5 border-transparent bg-transparent px-2 text-xs font-medium"
      >
        <Globe className="size-3.5" aria-hidden="true" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lng) => (
          <SelectItem key={lng.code} value={lng.code}>
            {t(`language.${lng.code}`, { defaultValue: lng.label })}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
