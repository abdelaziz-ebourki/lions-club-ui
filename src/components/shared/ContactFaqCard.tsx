import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How can I become a member?",
    a: "Attend one of our projects or send us a message through this form. We welcome new members who share our passion for community service — no experience needed.",
  },
  {
    q: "Do I need prior volunteering experience?",
    a: "Not at all. We provide training and guidance for every project. The only requirement is showing up.",
  },
  {
    q: "How often does the club meet?",
    a: "General meetings happen twice a month, with project-specific meetings as needed. Check our projects page for the schedule.",
  },
  {
    q: "Can I donate to support your projects?",
    a: "Yes — donations directly fund our community initiatives. Contact us and we'll walk you through how to contribute.",
  },
  {
    q: "Are there membership fees?",
    a: "A nominal annual fee covers administrative costs and supports our service projects. No one is turned away for inability to pay.",
  },
];

export function ContactFaqCard() {
  return (
    <Card>
      <CardHeader>
        <p className="font-display text-overline text-accent mb-1">
          FAQ
        </p>
        <CardTitle className="font-heading text-h4">
          Common Questions
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
