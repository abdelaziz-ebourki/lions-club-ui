import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionDivider } from "@/components/ui/section-divider";
import { ArrowRight, Calendar, Images } from "lucide-react";
import type { Event } from "@/types";
import { useFeaturedNews } from "@/hooks/useNewsList";
import { useGalleryList } from "@/hooks/useGalleryList";
import { HomeHero } from "@/components/shared/HomeHero";
import { HomeImpact } from "@/components/shared/HomeImpact";
import { HomeCta } from "@/components/shared/HomeCta";
import { SEO } from "@/components/shared/SEO";
import { useTranslation } from "react-i18next";
import { formatDate } from "@/lib/format";
import { seoConfig } from "@/config/seo";

export function HomePage() {
  const { t, i18n } = useTranslation();
  const { data: featuredNews } = useFeaturedNews();
  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["events", "upcoming"],
    queryFn: () => api.get("/events?status=upcoming"),
  });
  const { data: galleryData, isLoading: galleryLoading } = useGalleryList(1, 6);

  return (
    <>
      <SEO {...seoConfig.home} />
      <HomeHero />

      <HomeImpact />

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="font-display text-overline text-accent">
              {t("home.upcoming.overline")}
            </p>
            <h2 className="font-heading text-h2 mt-1 text-foreground">
              {t("home.upcoming.heading")}
            </h2>
          </div>
          <Link to="/events" className="hidden sm:block">
            <Button variant="ghost" size="sm">
              {t("home.upcoming.allProjects")} <ArrowRight data-icon="inline-end" />
            </Button>
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="size-4 rounded-full" />
                  </div>
                  <Skeleton className="h-6 w-48 mt-3" />
                  <Skeleton className="h-4 w-32 mt-1" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))
          ) : (
            events?.slice(0, 3).map((event) => (
              <Card key={event.id} className="group flex h-full flex-col transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="accent">{event.category}</Badge>
                    <Calendar className="size-4 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <CardTitle className="mt-3 font-heading text-xl group-hover:text-primary transition-colors">
                    {event.title}
                  </CardTitle>
                  <CardDescription className="text-body-sm">
                    {event.date}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                  <Link
                    to={`/events/${event.id}`}
                    className="mt-auto inline-flex items-center pt-4 text-sm font-medium text-accent hover:underline"
                  >
                    {t("home.upcoming.join")} <ArrowRight className="ms-1 size-3" />
                  </Link>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <Link to="/events" className="mt-6 text-center sm:hidden">
          <Button variant="ghost">
            {t("home.upcoming.allProjects")} <ArrowRight data-icon="inline-end" />
          </Button>
        </Link>

        {events?.length === 0 && (
          <div className="py-16 text-center">
            <p className="font-body text-muted-foreground">
              {t("home.upcoming.noProjects")}
            </p>
            <Link to="/contact">
              <Button variant="outline" className="mt-4">
                {t("home.upcoming.suggest")}
              </Button>
            </Link>
          </div>
        )}
      </section>

      {featuredNews && featuredNews.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="font-display text-overline text-accent">
                {t("home.news.overline")}
              </p>
              <h2 className="font-heading text-h2 mt-1 text-foreground">
                {t("home.news.heading")}
              </h2>
            </div>
            <Link to="/news" className="hidden sm:block">
              <Button variant="ghost" size="sm">
                {t("home.news.allNews")} <ArrowRight data-icon="inline-end" />
              </Button>
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredNews.map((article) => (
              <Card key={article.id} className="group flex h-full flex-col transition-all hover:shadow-lg">
                {article.featuredImage && (
                  <div className="overflow-hidden rounded-t-lg">
                    <img
                      src={article.featuredImage}
                      alt={article.title}
                      className="h-64 w-full object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                      width={800}
                      height={400}
                    />
                  </div>
                )}
                <CardHeader>
                  <Badge variant="accent" className="w-fit">{article.category}</Badge>
                  <CardTitle className="mt-3 font-heading text-xl group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </CardTitle>
                  <CardDescription className="text-body-sm line-clamp-2">
                    {article.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                  <div className="text-body-sm text-muted-foreground">
                    {article.publishedAt ? formatDate(article.publishedAt, i18n.language) : ""}
                  </div>
                  <Link
                    to={`/news/${article.slug}`}
                    className="mt-auto inline-flex items-center pt-4 text-sm font-medium text-accent hover:underline"
                  >
                    {t("home.news.readArticle")} <ArrowRight className="ms-1 size-3" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <Link to="/news" className="mt-6 text-center sm:hidden">
            <Button variant="ghost">
              {t("home.news.allNews")} <ArrowRight data-icon="inline-end" />
            </Button>
          </Link>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8" aria-labelledby="home-gallery-heading">
        <div className="flex items-end justify-between">
          <div>
            <p className="font-display text-overline text-accent">{t("home.gallery.overline")}</p>
            <h2 id="home-gallery-heading" className="font-heading text-h2 mt-1 text-foreground">
              {t("home.gallery.heading")}
            </h2>
            <p className="mt-2 max-w-2xl text-body-sm text-muted-foreground">
              {t("home.gallery.description")}
            </p>
          </div>
          <Link to="/gallery" className="hidden sm:block">
            <Button variant="ghost" size="sm">
              {t("home.gallery.viewGallery")} <ArrowRight data-icon="inline-end" />
            </Button>
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {galleryLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardHeader>
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-48 mt-2" />
                </CardHeader>
              </Card>
            ))
          ) : galleryData?.data && galleryData.data.length > 0 ? (
            galleryData.data.slice(0, 6).map((item) => (
              <Link key={item.id} to={`/gallery/${item.id}`} className="group h-full">
                <Card className="flex h-full flex-col overflow-hidden transition-all hover:shadow-lg">
                  <div className="overflow-hidden">
                    <img
                      src={item.thumbnailUrl ?? item.imageUrl}
                      alt={item.title}
                      className="h-64 w-full object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                      width={400}
                      height={300}
                    />
                  </div>
                  <CardHeader>
                    <Badge variant="accent" className="w-fit">
                      {item.category}
                    </Badge>
                    <CardTitle className="font-heading text-lg group-hover:text-primary transition-colors line-clamp-2">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <Images className="size-8 text-muted-foreground mb-3" aria-hidden="true" />
              <p className="text-sm text-muted-foreground">{t("home.gallery.noPhotos")}</p>
              <Link to="/gallery" className="mt-4">
                <Button variant="outline" size="sm">
                  {t("home.gallery.visitGallery")}
                </Button>
              </Link>
            </div>
          )}
        </div>

        <Link to="/gallery" className="mt-6 flex justify-center sm:hidden">
          <Button variant="ghost">
            {t("home.gallery.viewGallery")} <ArrowRight data-icon="inline-end" />
          </Button>
        </Link>
      </section>

      <SectionDivider />

      <HomeCta />
    </>
  );
}
