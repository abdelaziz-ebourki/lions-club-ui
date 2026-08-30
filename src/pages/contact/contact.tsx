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
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { Send } from "lucide-react";
import { useSuccessTimer } from "@/hooks/useSuccessTimer";
import { PageHero } from "@/components/shared/PageHero";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { SEO } from "@/components/shared/SEO";
import { seoConfig } from "@/config/seo";
import { ContactInfoCard } from "@/components/shared/ContactInfoCard";
import { ContactFaqCard } from "@/components/shared/ContactFaqCard";
import { useTranslation } from "react-i18next";

export function ContactPage() {
  const { t } = useTranslation("contact");
  const contactSchema = z.object({
    name: z.string().min(2, t("validationNameMin")).max(100, t("validationNameMax")),
    email: z.string().email(t("validationEmail")),
    subject: z.string().min(5, t("validationSubjectMin")).max(200, t("validationSubjectMax")),
    message: z.string().min(10, t("validationMessageMin")).max(2000, t("validationMessageMax")),
  });

  type ContactFormData = z.infer<typeof contactSchema>;

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const nameCount = form.watch("name").length;
  const subjectCount = form.watch("subject").length;
  const messageCount = form.watch("message").length;

  const { showSuccess, setShowSuccess, successTimer } = useSuccessTimer();

  const mutation = useMutation({
    mutationFn: (data: ContactFormData) => api.post("/contact", data),
  });

  function onSubmit(data: ContactFormData) {
    mutation.mutate(data, {
      onSuccess: () => {
        setShowSuccess(true);
        successTimer.current = setTimeout(() => setShowSuccess(false), 2000);
        toast.success(t("toastSuccess"));
      },
      onError: () => toast.error(t("toastError")),
    });
  }

  return (
    <>
      <SEO {...seoConfig.contact} />
      <Breadcrumbs trail={[{ label: t("breadcrumbsHome"), href: "/" }, { label: t("breadcrumbsContact") }]} />
      <PageHero
        overline={t("heroOverline")}
        heading={t("heroHeading")}
        description={t("heroDescription")}
      />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <p className="font-display text-overline text-accent mb-1">
                  {t("formOverline")}
                </p>
                <CardTitle className="font-heading text-h3">
                  {t("formTitle")}
                </CardTitle>
                <CardDescription className="text-body">
                  {t("formDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-6"
                >
                  <FieldGroup className={cn("transition-all duration-500", showSuccess && "ring-2 ring-green-500/50 rounded-lg")}>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {/* fallow-ignore-next-line code-duplication */}
                      <Field data-invalid={!!form.formState.errors.name}>
                        <FieldLabel htmlFor="name" className="after:content-['*'] after:ms-0.5 after:text-destructive">{t("fieldName")}</FieldLabel>
                        <FieldContent>
                          <Input id="name" placeholder={t("placeholderName")} aria-invalid={!!form.formState.errors.name} aria-required="true" {...form.register("name")} autoComplete="name" />
                          <FieldError errors={[form.formState.errors.name]} />
                          <span className={cn("text-body-xs", nameCount >= 100 ? "text-destructive" : nameCount >= 80 ? "text-amber-500" : "text-muted-foreground")} aria-live="polite">
                            {nameCount}/100
                          </span>
                        </FieldContent>
                      </Field>
                      <Field data-invalid={!!form.formState.errors.email}>
                        <FieldLabel htmlFor="email" className="after:content-['*'] after:ms-0.5 after:text-destructive">{t("fieldEmail")}</FieldLabel>
                        <FieldContent>
                          <Input id="email" type="email" placeholder={t("placeholderEmail")} aria-invalid={!!form.formState.errors.email} aria-required="true" {...form.register("email")} autoComplete="email" spellCheck={false} />
                          <FieldError errors={[form.formState.errors.email]} />
                        </FieldContent>
                      </Field>
                    </div>
                    <Field data-invalid={!!form.formState.errors.subject}>
                      <FieldLabel htmlFor="subject" className="after:content-['*'] after:ms-0.5 after:text-destructive">{t("fieldSubject")}</FieldLabel>
                      <FieldContent>
                        <Input id="subject" placeholder={t("placeholderSubject")} aria-invalid={!!form.formState.errors.subject} aria-required="true" {...form.register("subject")} autoComplete="off" />
                        <FieldError errors={[form.formState.errors.subject]} />
                        <span className={cn("text-body-xs", subjectCount >= 200 ? "text-destructive" : subjectCount >= 160 ? "text-amber-500" : "text-muted-foreground")} aria-live="polite">
                          {subjectCount}/200
                        </span>
                      </FieldContent>
                    </Field>
                    <Field data-invalid={!!form.formState.errors.message}>
                      <FieldLabel htmlFor="message" className="after:content-['*'] after:ms-0.5 after:text-destructive">{t("fieldMessage")}</FieldLabel>
                      <FieldContent>
                        <Textarea id="message" placeholder={t("placeholderMessage")} rows={5} aria-invalid={!!form.formState.errors.message} aria-required="true" {...form.register("message")} autoComplete="off" />
                        <FieldError errors={[form.formState.errors.message]} />
                        <span className={cn("text-body-xs", messageCount >= 2000 ? "text-destructive" : messageCount >= 1600 ? "text-amber-500" : "text-muted-foreground")} aria-live="polite">
                          {messageCount}/2000
                        </span>
                      </FieldContent>
                    </Field>
                  </FieldGroup>
                  <Button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full sm:w-auto"
                  >
                    {mutation.isPending ? (
                      <><Spinner className="me-2" /> {t("sending")}</>
                    ) : (
                      <>
                        {t("sendMessage")}{" "}
                        <Send data-icon="inline-end" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col gap-6 lg:col-span-2">
            <ContactInfoCard />
            <ContactFaqCard />
          </div>
        </div>
      </section>
    </>
  );
}
