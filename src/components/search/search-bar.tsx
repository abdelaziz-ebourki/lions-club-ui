import { useState, useCallback, useRef, type FormEvent, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { sanitizeQuery } from "@/lib/search";
import { useTranslation } from "react-i18next";

export interface SearchBarProps {
  className?: string;
}

export function SearchBar({ className }: SearchBarProps) {
  const { t } = useTranslation("search");
  const [value, setValue] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

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
        <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="search"
          role="searchbox"
          placeholder={t("placeholder")}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="w-64 ps-9"
          aria-label={t("label")}
        />
      </div>
    </form>
  );
}
