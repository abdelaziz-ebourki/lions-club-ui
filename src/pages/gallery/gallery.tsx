import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Event as EventType, GalleryItem } from "@/types";
import { galleryCategories } from "@/config";
import { ImageOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/ErrorState";
import { GallerySkeleton } from "@/components/shared/GallerySkeleton";
import { LightboxViewer } from "@/components/shared/LightboxViewer";
import { SEO } from "@/components/shared/SEO";
import { seoConfig } from "@/config/seo";
import { useGalleryList, useGalleryItem, type GalleryFilters } from "@/hooks/useGalleryList";
import { useTranslation } from "react-i18next";

const EMPTY_FILTERS: GalleryFilters = { category: "", eventId: "" };

export function GalleryPage() {
  const { t } = useTranslation(["gallery", "common"]);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<GalleryFilters>(EMPTY_FILTERS);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const { data, isLoading, isError, refetch } = useGalleryList(page, 12, filters);
  const { data: events } = useQuery<EventType[]>({
    queryKey: ["events"],
    queryFn: () => api.get("/events"),
    enabled: !id,
  });
  const deepLink = useGalleryItem(id);

  const gridItems = data?.data ?? [];
  const deepItem = deepLink.data && !Array.isArray(deepLink.data) ? deepLink.data : undefined;
  const viewerItems: GalleryItem[] = id ? (deepItem ? [deepItem] : []) : gridItems;
  const viewerOpen = id ? !!deepItem : viewerIndex !== null && gridItems.length > 0;
  const activeTitle = viewerOpen ? (id ? viewerItems[0] : viewerItems[viewerIndex!])?.title : undefined;

  useEffect(() => {
    if (activeTitle) {
      document.title = `${activeTitle} | Lions Club FSBM`;
      return () => {
        document.title = "Lions Club FSBM";
      };
    }
  }, [activeTitle]);

  function closeViewer() {
    if (id) {
      navigate("/gallery");
      return;
    }
    setViewerIndex(null);
    triggerRef.current?.focus();
  }

  function setFilter(key: keyof GalleryFilters, value: string) {
    setFilters((f) => ({ ...f, [key]: value }));
    setPage(1);
    setViewerIndex(null);
  }

  if (id && deepLink.isLoading) {
    return (
      <>
        <SEO {...seoConfig.gallery} />
        <Breadcrumbs trail={[{ label: t("breadcrumbs.home"), href: "/" }, { label: t("nav.gallery"), href: "/gallery" }, { label: t("gallery:loading") }]} />
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <GallerySkeleton />
        </section>
      </>
    );
  }

  if (id && deepLink.isError) {
    const status = (deepLink.error as { status?: number })?.status;
    if (status === 404) {
      return (
        <>
          <SEO {...seoConfig.gallery} />
          <Breadcrumbs trail={[{ label: t("breadcrumbs.home"), href: "/" }, { label: t("nav.gallery"), href: "/gallery" }, { label: t("gallery:notFound") }]} />
          <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
            <h1 className="font-heading text-h3">{t("gallery:photoNotFound")}</h1>
            <p className="mt-2 text-muted-foreground">{t("gallery:photoNotFoundDesc")}</p>
            <Link to="/gallery" className="mt-6 inline-block">
              <Button>{t("gallery:backToGallery")}</Button>
            </Link>
          </div>
        </>
      );
    }
    return (
      <>
        <SEO {...seoConfig.gallery} />
        <Breadcrumbs trail={[{ label: t("breadcrumbs.home"), href: "/" }, { label: t("nav.gallery"), href: "/gallery" }, { label: t("gallery:error") }]} />
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <ErrorState
            heading={t("gallery:failedToLoad")}
            message={t("gallery:failedToLoadPhotoDesc")}
            onRetry={() => deepLink.refetch()}
            retryLabel={t("retry")}
          />
        </section>
      </>
    );
  }

  return (
    <>
      <SEO {...seoConfig.gallery} />
      <Breadcrumbs trail={[{ label: t("breadcrumbs.home"), href: "/" }, { label: t("nav.gallery") }]} />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {!id && (
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-display text-overline text-accent">{t("gallery:overline")}</p>
              <h1 className="font-heading text-h2 mt-1 text-foreground">{t("gallery:heading")}</h1>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Select value={filters.category as string} onValueChange={(v) => setFilter("category", !v || v === t("gallery:allCategories") ? "" : v)}>
                <SelectTrigger aria-label={t("gallery:filterByCategory")} className="w-[180px]">
                  <SelectValue placeholder={t("gallery:allCategories")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={t("gallery:allCategories")}>{t("gallery:allCategories")}</SelectItem>
                  {galleryCategories.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filters.eventId as string} onValueChange={(v) => setFilter("eventId", !v || v === t("gallery:allEvents") ? "" : v)}>
                <SelectTrigger aria-label={t("gallery:filterByEvent")} className="w-[200px]">
                  <SelectValue placeholder={t("gallery:allEvents")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={t("gallery:allEvents")}>{t("gallery:allEvents")}</SelectItem>
                  {(events ?? []).map((e) => (
                    <SelectItem key={e.id} value={e.id}>{e.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <div className="mt-10">
          {isLoading ? (
            <GallerySkeleton />
          ) : isError ? (
            <ErrorState
              heading={t("gallery:somethingWentWrong")}
              message={t("gallery:failedToLoadGallery")}
              onRetry={() => refetch()}
              retryLabel={t("retry")}
            />
          ) : !data || data.data.length === 0 ? (
            (filters.category || filters.eventId) ? (
              <EmptyState
                icon={ImageOff}
                title={t("gallery:noMatch")}
                description={t("gallery:noMatchDescription")}
                action={
                  <Button variant="outline" onClick={() => setFilters({ category: '', eventId: '' })}>
                    {t("gallery:clearFilters")}
                  </Button>
                }
              />
            ) : (
              <EmptyState icon={ImageOff} title={t("gallery:noPhotos")} description={t("gallery:noPhotosDescription")} />
            )
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.data.map((item, idx) => (
                <Card
                  key={item.id}
                  data-testid="gallery-card"
                  role="button"
                  tabIndex={0}
                  aria-label={item.title}
                  onClick={(e) => {
                    triggerRef.current = e.currentTarget;
                    setViewerIndex(idx);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      triggerRef.current = e.currentTarget;
                      setViewerIndex(idx);
                    }
                  }}
                  className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <img
                    src={item.thumbnailUrl ?? item.imageUrl}
                    alt={item.title}
                    loading="lazy"
                    width={400}
                    height={300}
                    className="h-48 w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="space-y-2 p-4">
                    <Badge variant="accent">{item.category}</Badge>
                    <p data-testid="gallery-card-title" className="font-heading text-lg text-foreground line-clamp-2">
                      {item.title}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {data && data.totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-4">
            <Button variant="outline" onClick={() => { setPage((p) => Math.max(1, p - 1)); setViewerIndex(null); }} disabled={page <= 1}>
              {t("gallery:previous")}
            </Button>
            <span data-testid="gallery-pagination" className="text-body-sm text-muted-foreground">
              {t("gallery:page", { page: data.page, total: data.totalPages })}
            </span>
            <Button variant="outline" onClick={() => { setPage((p) => Math.min(data.totalPages, p + 1)); setViewerIndex(null); }} disabled={page >= data.totalPages}>
              {t("gallery:next")}
            </Button>
          </div>
        )}
      </section>

      {viewerOpen && (
        <LightboxViewer items={viewerItems} index={id ? 0 : viewerIndex!} onClose={closeViewer} />
      )}
    </>
  );
}
