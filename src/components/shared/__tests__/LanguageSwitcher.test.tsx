import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, beforeEach } from "vitest";
import { LanguageSwitcher } from "../LanguageSwitcher";
import i18n from "@/i18n/config";

describe("LanguageSwitcher", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("en");
    localStorage.clear();
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  });

  test("renders with current language", () => {
    render(<LanguageSwitcher />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  test("changes language to fr and updates html attrs and storage", async () => {
    const user = userEvent.setup();
    render(<LanguageSwitcher />);
    const trigger = screen.getByRole("combobox");
    await user.click(trigger);
    const frOption = await screen.findByRole("option", { name: /français/i });
    await user.click(frOption);
    await waitFor(() => expect(i18n.language).toBe("fr"));
    expect(document.documentElement.lang).toBe("fr");
    expect(document.documentElement.dir).toBe("ltr");
    expect(localStorage.getItem("i18nextLng")).toBe("fr");
  });

  test("changes language to ar and sets dir rtl", async () => {
    const user = userEvent.setup();
    render(<LanguageSwitcher />);
    const trigger = screen.getByRole("combobox");
    await user.click(trigger);
    const arOption = await screen.findByRole("option", { name: /العربية/i });
    await user.click(arOption);
    await waitFor(() => expect(i18n.language).toBe("ar"));
    expect(document.documentElement.lang).toBe("ar");
    expect(document.documentElement.dir).toBe("rtl");
  });
});
