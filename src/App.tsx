import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { RequireAdmin } from "@/components/shared/require-admin";
import { RequireVerifiedEmail } from "@/components/shared/require-verified-email";
import { PageSkeleton } from "@/components/shared/page-skeleton";
import { Shell } from "@/components/layout/shell";
import { HomePage } from "@/pages/home/home";
import { AboutPage } from "@/pages/about/about";
import { EventsPage } from "@/pages/events/events";
import { ContactPage } from "@/pages/contact/contact";
import { ProfilePage } from "@/pages/profile/profile";
import { VerifyEmailPage } from "@/pages/verify-email";
import { NewsPage } from "@/pages/news/news";
import { GalleryPage } from "@/pages/gallery/gallery";
import { ForumPage } from "@/pages/forum/forum";
import { LoginPage } from "@/pages/auth/login";
import { RegisterPage } from "@/pages/auth/register";
import { ForgotPasswordPage } from "@/pages/auth/forgot-password";
import { ResetPasswordPage } from "@/pages/auth/reset-password";
import { NotFoundPage } from "@/pages/not-found";
import { AppProviders } from "@/components/shared/AppProviders";

const EventDetailPage = lazy(() => import("@/pages/events/event-detail").then(m => ({ default: m.EventDetailPage })));
const ThreadsPage = lazy(() => import("@/pages/forum/threads").then(m => ({ default: m.ThreadsPage })));
const NewThreadForm = lazy(() => import("@/pages/forum/new-thread-form").then(m => ({ default: m.NewThreadForm })));
const ThreadDetailPage = lazy(() => import("@/pages/forum/thread-detail").then(m => ({ default: m.ThreadDetailPage })));
const SearchPage = lazy(() => import("@/pages/search/search-page").then(m => ({ default: m.SearchPage })));
const NewsDetailPage = lazy(() => import("@/pages/news/news-detail").then(m => ({ default: m.NewsDetailPage })));
const MembersPage = lazy(() => import("@/pages/members/members").then(m => ({ default: m.MembersPage })));
const MemberDetailPage = lazy(() => import("@/pages/members/member-detail").then(m => ({ default: m.MemberDetailPage })));
const EventFormPage = lazy(() => import("@/pages/admin/event-form").then(m => ({ default: m.EventFormPage })));
const MemberFormPage = lazy(() => import("@/pages/admin/member-form").then(m => ({ default: m.MemberFormPage })));
const AdminLayout = lazy(() => import("@/pages/admin/admin-layout").then(m => ({ default: m.AdminLayout })));
const AdminDashboardPage = lazy(() => import("@/pages/admin/dashboard").then(m => ({ default: m.AdminDashboardPage })));
const AdminEventsPage = lazy(() => import("@/pages/admin/admin-events").then(m => ({ default: m.AdminEventsPage })));
const AdminMembersPage = lazy(() => import("@/pages/admin/admin-members").then(m => ({ default: m.AdminMembersPage })));
const AdminMessagesPage = lazy(() => import("@/pages/admin/admin-messages").then(m => ({ default: m.AdminMessagesPage })));
const AdminForumPage = lazy(() => import("@/pages/admin/admin-forum").then(m => ({ default: m.AdminForumPage })));
const AdminNewsPage = lazy(() => import("@/pages/admin/admin-news").then(m => ({ default: m.AdminNewsPage })));
const NewsFormPage = lazy(() => import("@/pages/admin/news-form").then(m => ({ default: m.NewsFormPage })));
const AdminGalleryPage = lazy(() => import("@/pages/admin/admin-gallery").then(m => ({ default: m.AdminGalleryPage })));
const GalleryFormPage = lazy(() => import("@/pages/admin/gallery-form").then(m => ({ default: m.GalleryFormPage })));

export default function App() {
  return (
    <AppProviders>
      <Routes>
        <Route element={<Shell />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="events/:id" element={
            <Suspense fallback={<PageSkeleton />}><EventDetailPage /></Suspense>
          } />
          <Route path="contact" element={<ContactPage />} />
          <Route path="forum" element={<ForumPage />} />
          <Route path="forum/:categoryId" element={
            <Suspense fallback={<PageSkeleton />}><ThreadsPage /></Suspense>
          } />
          <Route path="forum/:categoryId/new" element={
            <Suspense fallback={<PageSkeleton />}><NewThreadForm /></Suspense>
          } />
          <Route path="forum/:categoryId/:threadId" element={
            <Suspense fallback={<PageSkeleton />}><ThreadDetailPage /></Suspense>
          } />
          <Route path="news" element={<NewsPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="gallery/:id" element={<GalleryPage />} />
          <Route path="members" element={<Suspense fallback={<PageSkeleton />}><MembersPage /></Suspense>} />
          <Route path="members/:id" element={<Suspense fallback={<PageSkeleton />}><MemberDetailPage /></Suspense>} />
          <Route path="news/:slug" element={
            <Suspense fallback={<PageSkeleton />}><NewsDetailPage /></Suspense>
          } />
          <Route path="search" element={
            <Suspense fallback={<PageSkeleton />}><SearchPage /></Suspense>
          } />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="verify-email" element={<VerifyEmailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="/admin" element={
          <Suspense fallback={<PageSkeleton />}>
            <RequireAdmin><RequireVerifiedEmail><AdminLayout /></RequireVerifiedEmail></RequireAdmin>
          </Suspense>
        }>
          <Route index element={
            <Suspense fallback={<PageSkeleton />}><AdminDashboardPage /></Suspense>
          } />
          <Route path="events" element={
            <Suspense fallback={<PageSkeleton />}><AdminEventsPage /></Suspense>
          } />
          <Route path="events/new" element={
            <Suspense fallback={<PageSkeleton />}><EventFormPage /></Suspense>
          } />
          <Route path="events/:id/edit" element={
            <Suspense fallback={<PageSkeleton />}><EventFormPage /></Suspense>
          } />
          <Route path="members" element={
            <Suspense fallback={<PageSkeleton />}><AdminMembersPage /></Suspense>
          } />
          <Route path="members/new" element={
            <Suspense fallback={<PageSkeleton />}><MemberFormPage /></Suspense>
          } />
          <Route path="members/:id/edit" element={
            <Suspense fallback={<PageSkeleton />}><MemberFormPage /></Suspense>
          } />
          <Route path="messages" element={
            <Suspense fallback={<PageSkeleton />}><AdminMessagesPage /></Suspense>
          } />
          <Route path="forum" element={
            <Suspense fallback={<PageSkeleton />}><AdminForumPage /></Suspense>
          } />
          <Route path="news" element={
            <Suspense fallback={<PageSkeleton />}><AdminNewsPage /></Suspense>
          } />
          <Route path="news/new" element={
            <Suspense fallback={<PageSkeleton />}><NewsFormPage /></Suspense>
          } />
          <Route path="news/:id/edit" element={
            <Suspense fallback={<PageSkeleton />}><NewsFormPage /></Suspense>
          } />
          <Route path="gallery" element={
            <Suspense fallback={<PageSkeleton />}><AdminGalleryPage /></Suspense>
          } />
          <Route path="gallery/new" element={
            <Suspense fallback={<PageSkeleton />}><GalleryFormPage /></Suspense>
          } />
          <Route path="gallery/:id/edit" element={
            <Suspense fallback={<PageSkeleton />}><GalleryFormPage /></Suspense>
          } />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AppProviders>
  );
}
