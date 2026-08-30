import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { NewsFormFields } from "@/components/shared/NewsFormFields";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { useNewsForm } from "@/hooks/useNewsForm";

export function NewsFormPage() {
  const { t } = useTranslation("admin");
  const { form, mutation, onSubmit, showSuccess, title, excerpt: rawExcerpt, handleTitleChange, handleSlugChange, isEditing, article } = useNewsForm();
  const excerpt = rawExcerpt ?? "";

  const formLabel = isEditing ? (article ? `Edit ${article.title}` : t("news.form.editArticleBreadcrumb")) : t("news.form.newArticleBreadcrumb");

  return (
    <div>
      <Breadcrumbs trail={[
        { label: t("news.breadcrumbs.home"), href: "/" },
        { label: t("news.breadcrumbs.admin"), href: "/admin" },
        { label: t("news.breadcrumbs.news"), href: "/admin/news" },
        { label: formLabel },
      ]} />
      <Link to="/admin/news">
        <Button variant="ghost" className="mb-8">
          <ArrowLeft data-icon="inline-start" /> {t("news.form.backToNews")}
        </Button>
      </Link>

      <div className="mb-8">
        <p className="font-display text-overline text-accent">
          {isEditing ? t("news.form.overlineEdit") : t("news.form.overlineNew")} {t("news.form.overlineSuffix")}
        </p>
        <h1 className="font-heading text-h2 mt-1 text-foreground">
          {isEditing ? t("news.form.headingEdit") : t("news.form.headingCreate")}
        </h1>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <NewsFormFields
            form={form}
            title={title}
            excerpt={excerpt}
            handleTitleChange={handleTitleChange}
            handleSlugChange={handleSlugChange}
            showSuccess={showSuccess}
            mutationPending={mutation.isPending}
          />
          <Button type="submit" disabled={mutation.isPending} className="w-full sm:w-auto">
            {mutation.isPending ? (
              <><Spinner className="mr-2" /> {t("news.form.buttons.saving")}</>
            ) : isEditing ? t("news.form.buttons.update") : t("news.form.buttons.create")}
          </Button>
        </form>
      </div>
    </div>
  );
}
