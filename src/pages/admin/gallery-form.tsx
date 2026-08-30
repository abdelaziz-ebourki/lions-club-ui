import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { GalleryFormFields } from "@/components/shared/GalleryFormFields";
import { useGalleryForm } from "@/hooks/useGalleryForm";

export function GalleryFormPage() {
  const { t } = useTranslation("admin");
  const { form, mutation, onSubmit, showSuccess, isEditing } = useGalleryForm();
  const { data: events } = useQuery<{ id: string; title: string }[]>({
    queryKey: ["events"],
    queryFn: () => api.get("/events"),
  });

  return (
    <div>
      <Breadcrumbs trail={[
        { label: t("gallery.breadcrumbs.home"), href: "/" },
        { label: t("gallery.breadcrumbs.admin"), href: "/admin" },
        { label: t("gallery.breadcrumbs.gallery"), href: "/admin/gallery" },
        { label: isEditing ? t("gallery.form.editItemBreadcrumb") : t("gallery.form.newItemBreadcrumb") },
      ]} />
      <Link to="/admin/gallery">
        <Button variant="ghost" className="mb-8">
          <ArrowLeft data-icon="inline-start" /> {t("gallery.form.backToGallery")}
        </Button>
      </Link>

      <div className="mb-8">
        <p className="font-display text-overline text-accent">
          {isEditing ? t("gallery.form.overlineEdit") : t("gallery.form.overlineUpload")} {t("gallery.form.overlineSuffix")}
        </p>
        <h1 className="font-heading text-h2 mt-1 text-foreground">
          {isEditing ? t("gallery.form.headingEdit") : t("gallery.form.headingCreate")}
        </h1>
      </div>

      <div className={showSuccess ? "rounded-lg ring-2 ring-green-500/50" : undefined}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex max-w-2xl flex-col gap-6">
          <GalleryFormFields form={form} events={events ?? []} />
          <Button type="submit" disabled={mutation.isPending} className="w-full sm:w-auto">
            {mutation.isPending ? (
              <><Spinner className="mr-2" /> {t("gallery.form.buttons.uploading")}</>
            ) : isEditing ? t("gallery.form.buttons.update") : t("gallery.form.buttons.create")}
          </Button>
        </form>
      </div>
    </div>
  );
}
