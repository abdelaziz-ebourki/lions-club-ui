import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { NewsFormFields } from "@/components/shared/NewsFormFields";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { useNewsForm } from "@/hooks/useNewsForm";

export function NewsFormPage() {
  const { form, mutation, onSubmit, showSuccess, title, excerpt: rawExcerpt, handleTitleChange, handleSlugChange, isEditing, article } = useNewsForm();
  const excerpt = rawExcerpt ?? "";

  const formLabel = isEditing ? (article ? `Edit ${article.title}` : "Edit Article") : "New Article";

  return (
    <div>
      <Breadcrumbs trail={[
        { label: "Home", href: "/" },
        { label: "Admin", href: "/admin" },
        { label: "News", href: "/admin/news" },
        { label: formLabel },
      ]} />
      <Link to="/admin/news">
        <Button variant="ghost" className="mb-8">
          <ArrowLeft data-icon="inline-start" /> Back to News
        </Button>
      </Link>

      <div className="mb-8">
        <p className="font-display text-overline text-accent">
          {isEditing ? "Edit" : "New"} Article
        </p>
        <h1 className="font-heading text-h2 mt-1 text-foreground">
          {isEditing ? "Edit Article" : "Create Article"}
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
              <><Spinner className="mr-2" /> Saving...</>
            ) : isEditing ? "Update Article" : "Create Article"}
          </Button>
        </form>
      </div>
    </div>
  );
}
