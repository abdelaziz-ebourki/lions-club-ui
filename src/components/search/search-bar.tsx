import { useState, useCallback, useRef, type FormEvent, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { sanitizeQuery } from "@/lib/search";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export interface SearchBarProps {
  className?: string;
  tone?: "onDark" | "onLight";
}

export function SearchBar({ className, tone = "onLight" }: SearchBarProps) {
  const { t } = useTranslation("search");
  const [value, setValue] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const iconTone = cn(
    "pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2",
    tone === "onDark" ? "text-white/70" : "text-muted-foreground"
  );
  const inputTone = cn(
    "w-64 ps-9",
    tone === "onDark" && "border-b-white/30 text-white placeholder:text-white/60 focus-visible:border-b-white"
  );

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const parsed = sanitizeQuery(value);
      if (parsed.isEmpty) {
        navigate("/search");
      } else {
        navigate(`/search?q=${encodeURIComponent(parsed.sanitized)}`);
      }
    },
    [value, navigate],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape") {
        setValue("");
        inputRef.current?.blur();
      }
    },
    [],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.value.length <= 200) {
        setValue(e.target.value);
      }
    },
    [],
  );

  return (
    <form onSubmit={handleSubmit} className={className} role="search">
      <div className="relative">
        <Search className={iconTone} />
        <Input
          ref={inputRef}
          type="search"
          role="searchbox"
          placeholder={t("placeholder")}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={inputTone}
          aria-label={t("label")}
        />
      </div>
    </form>
  );
}
