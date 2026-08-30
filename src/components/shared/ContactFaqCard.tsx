import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslation } from "react-i18next";

export function ContactFaqCard() {
  const { t } = useTranslation("contact");
  const faqs = [
    { q: t("faq1Q"), a: t("faq1A") },
    { q: t("faq2Q"), a: t("faq2A") },
    { q: t("faq3Q"), a: t("faq3A") },
    { q: t("faq4Q"), a: t("faq4A") },
    { q: t("faq5Q"), a: t("faq5A") },
  ];

  return (
    <Card>
      <CardHeader>
        <p className="font-display text-overline text-accent mb-1">
          {t("faqOverline")}
        </p>
        <CardTitle className="font-heading text-h4">
          {t("faqTitle")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-body-sm text-left">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-body-sm text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
