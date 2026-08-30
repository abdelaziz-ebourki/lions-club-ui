import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { SEO } from "@/components/shared/SEO";
import { seoConfig } from "@/config/seo";

export function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <>
      <SEO {...seoConfig.notFound} />
      <Breadcrumbs trail={[{ label: t("breadcrumbs.home"), href: "/" }, { label: t("notFound.title") }]} />
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-20 text-center">
      <div role="alert">
        <p className="font-display text-overline text-accent mb-2">
          {t("notFound.error")}
        </p>
        <h1 className="font-heading text-h1 text-foreground">
          {t("notFound.title")}
        </h1>
      </div>
      <p className="mt-4 text-body text-muted-foreground">
        {t("notFound.description")}
      </p>
      <div className="mt-8">
        <Link to="/">
          <Button>{t("notFound.goHome")}</Button>
        </Link>
      </div>
    </div>
    </>
  );
}
