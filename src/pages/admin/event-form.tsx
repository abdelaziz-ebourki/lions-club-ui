import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { EventFormFields } from "@/components/shared/EventFormFields";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { useEventForm } from "@/hooks/useEventForm";
import { useTranslation } from "react-i18next";

export function EventFormPage() {
  const { t } = useTranslation("admin");
  const { form, mutation, onSubmit, showSuccess, titleCount, descCount, locationCount, isEditing, event } = useEventForm();

  const formLabel = isEditing ? (event ? `Edit ${event.title}` : t("events.form.editEventBreadcrumb")) : t("events.form.newEventBreadcrumb");

  return (
    <div>
      <Breadcrumbs trail={[
        { label: t("events.breadcrumbs.home"), href: "/" },
        { label: t("events.breadcrumbs.admin"), href: "/admin" },
        { label: t("events.breadcrumbs.events"), href: "/admin/events" },
        { label: formLabel },
      ]} />
      <Link to="/admin/events">
        <Button variant="ghost" className="mb-8">
          <ArrowLeft data-icon="inline-start" /> {t("events.form.backToEvents")}
        </Button>
      </Link>

      <div className="mb-8">
        <p className="font-display text-overline text-accent">
          {isEditing ? t("events.form.overlineEdit") : t("events.form.overlineNew")} {t("events.form.overlineSuffix")}
        </p>
        <h1 className="font-heading text-h2 mt-1 text-foreground">
          {isEditing ? t("events.form.headingEdit") : t("events.form.headingCreate")}
        </h1>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <EventFormFields
            form={form}
            titleCount={titleCount}
            descCount={descCount}
            locationCount={locationCount}
            showSuccess={showSuccess}
            mutationPending={mutation.isPending}
          />
          <Button type="submit" disabled={mutation.isPending} className="w-full sm:w-auto">
            {mutation.isPending ? (
              <><Spinner className="mr-2" /> {t("events.form.buttons.saving")}</>
            ) : isEditing ? t("events.form.buttons.update") : t("events.form.buttons.create")}
          </Button>
        </form>
      </div>
    </div>
  );
}
