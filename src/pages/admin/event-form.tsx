import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { EventFormFields } from "@/components/shared/EventFormFields";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { useEventForm } from "@/hooks/useEventForm";

export function EventFormPage() {
  const { form, mutation, onSubmit, showSuccess, titleCount, descCount, locationCount, isEditing, event } = useEventForm();

  const formLabel = isEditing ? (event ? `Edit ${event.title}` : "Edit Event") : "New Event";

  return (
    <div>
      <Breadcrumbs trail={[
        { label: "Home", href: "/" },
        { label: "Admin", href: "/admin" },
        { label: "Events", href: "/admin/events" },
        { label: formLabel },
      ]} />
      <Link to="/admin/events">
        <Button variant="ghost" className="mb-8">
          <ArrowLeft data-icon="inline-start" /> Back to Events
        </Button>
      </Link>

      <div className="mb-8">
        <p className="font-display text-overline text-accent">
          {isEditing ? "Edit" : "New"} Project
        </p>
        <h1 className="font-heading text-h2 mt-1 text-foreground">
          {isEditing ? "Edit Project" : "Create Project"}
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
              <><Spinner className="mr-2" /> Saving...</>
            ) : isEditing ? "Update Project" : "Create Project"}
          </Button>
        </form>
      </div>
    </div>
  );
}
