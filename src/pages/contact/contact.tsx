import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FieldGroup, Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { siteConfig } from "@/config";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const faqs = [
  {
    q: "How can I become a member?",
    a: "You can attend one of our events or contact us through this form. We welcome new members who share our passion for community service.",
  },
  {
    q: "Do I need prior volunteering experience?",
    a: "Not at all! We welcome everyone regardless of experience. We provide training and guidance for all our activities.",
  },
  {
    q: "How often does the club meet?",
    a: "We hold general meetings twice a month, with additional project-specific meetings as needed. Check our events page for the schedule.",
  },
  {
    q: "Can I donate to support your projects?",
    a: "Yes! We welcome donations that support our community initiatives. Contact us for more information on how to contribute.",
  },
  {
    q: "Are there membership fees?",
    a: "Yes, there is a nominal annual membership fee that goes toward administrative costs and supporting our service projects.",
  },
];

export function ContactPage() {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const mutation = useMutation({
    mutationFn: (data: ContactFormData) => api.post("/contact", data),
  });

  function onSubmit(data: ContactFormData) {
    mutation.mutate(data, {
      onSuccess: () => toast.success("Message sent! We'll get back to you soon."),
      onError: () => toast.error("Failed to send. Please try again."),
    });
  }

  return (
    <>
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-4 border-accent text-accent">
              Contact
            </Badge>
            <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
              Get in Touch
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Have a question, suggestion, or want to get involved? We'd love
              to hear from you.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-2xl">
                  Send us a Message
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as
                  possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-6"
                >
                  <FieldGroup>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field data-invalid={!!form.formState.errors.name}>
                        <FieldLabel htmlFor="name">Name</FieldLabel>
                        <FieldContent>
                          <Input id="name" placeholder="Your name" aria-invalid={!!form.formState.errors.name} {...form.register("name")} autoComplete="name" />
                          <FieldError errors={[form.formState.errors.name]} />
                        </FieldContent>
                      </Field>
                      <Field data-invalid={!!form.formState.errors.email}>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <FieldContent>
                          <Input id="email" type="email" placeholder="your@email.com" aria-invalid={!!form.formState.errors.email} {...form.register("email")} autoComplete="email" spellCheck={false} />
                          <FieldError errors={[form.formState.errors.email]} />
                        </FieldContent>
                      </Field>
                    </div>
                    <Field data-invalid={!!form.formState.errors.subject}>
                      <FieldLabel htmlFor="subject">Subject</FieldLabel>
                      <FieldContent>
                        <Input id="subject" placeholder="How can we help?" aria-invalid={!!form.formState.errors.subject} {...form.register("subject")} autoComplete="off" />
                        <FieldError errors={[form.formState.errors.subject]} />
                      </FieldContent>
                    </Field>
                    <Field data-invalid={!!form.formState.errors.message}>
                      <FieldLabel htmlFor="message">Message</FieldLabel>
                      <FieldContent>
                        <Textarea id="message" placeholder="Tell us more..." rows={5} aria-invalid={!!form.formState.errors.message} {...form.register("message")} autoComplete="off" />
                        <FieldError errors={[form.formState.errors.message]} />
                      </FieldContent>
                    </Field>
                  </FieldGroup>
                  <Button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full sm:w-auto"
                  >
                    {mutation.isPending ? (
                      "Sending..."
                    ) : (
                      <>
                        Send Message{" "}
                        <Send data-icon="inline-end" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col gap-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-xl">
                  Contact Info
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 text-sm">
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">
                      {siteConfig.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-muted-foreground">
                      {siteConfig.phone}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-muted-foreground">
                      {siteConfig.address}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-xl">
                  FAQ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion className="w-full">
                  {faqs.map((faq, i) => (
                    <AccordionItem key={i} value={`faq-${i}`}>
                      <AccordionTrigger className="text-sm text-left">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
