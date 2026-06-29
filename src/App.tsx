import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/contexts/theme";
import { AuthProvider } from "@/contexts/auth";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { PageSkeleton } from "@/components/shared/page-skeleton";
import { Shell } from "@/components/layout/shell";
import { HomePage } from "@/pages/home/home";
import { AboutPage } from "@/pages/about/about";
import { EventsPage } from "@/pages/events/events";
import { ContactPage } from "@/pages/contact/contact";
import { ForumPage } from "@/pages/forum/forum";
import { LoginPage } from "@/pages/auth/login";
import { RegisterPage } from "@/pages/auth/register";
import { NotFoundPage } from "@/pages/not-found";

const EventDetailPage = lazy(() => import("@/pages/events/event-detail").then(m => ({ default: m.EventDetailPage })));
const ThreadListPage = lazy(() => import("@/pages/forum/threads").then(m => ({ default: m.ThreadsPage })));
const NewThreadForm = lazy(() => import("@/pages/forum/new-thread-form").then(m => ({ default: m.NewThreadForm })));
const ThreadDetailPage = lazy(() => import("@/pages/forum/thread-detail").then(m => ({ default: m.ThreadDetailPage })));
const EventFormPage = lazy(() => import("@/pages/admin/event-form").then(m => ({ default: m.EventFormPage })));
const MemberFormPage = lazy(() => import("@/pages/admin/member-form").then(m => ({ default: m.MemberFormPage })));
const AdminLayout = lazy(() => import("@/pages/admin/admin-layout").then(m => ({ default: m.AdminLayout })));
const DashboardPage = lazy(() => import("@/pages/admin/dashboard").then(m => ({ default: m.AdminDashboardPage })));
const AdminEventsPage = lazy(() => import("@/pages/admin/admin-events").then(m => ({ default: m.AdminEventsPage })));
const AdminMembersPage = lazy(() => import("@/pages/admin/admin-members").then(m => ({ default: m.AdminMembersPage })));
const AdminMessagesPage = lazy(() => import("@/pages/admin/admin-messages").then(m => ({ default: m.AdminMessagesPage })));
const AdminForumPage = lazy(() => import("@/pages/admin/admin-forum").then(m => ({ default: m.AdminForumPage })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Toaster position="top-right" richColors closeButton />
          <BrowserRouter>
            <ErrorBoundary>
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
                    <Suspense fallback={<PageSkeleton />}><ThreadListPage /></Suspense>
                  } />
                  <Route path="forum/:categoryId/new" element={
                    <Suspense fallback={<PageSkeleton />}><NewThreadForm /></Suspense>
                  } />
                  <Route path="forum/:categoryId/:threadId" element={
                    <Suspense fallback={<PageSkeleton />}><ThreadDetailPage /></Suspense>
                  } />
                  <Route path="login" element={<LoginPage />} />
                  <Route path="register" element={<RegisterPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
                <Route path="/admin" element={
                  <Suspense fallback={<PageSkeleton />}><AdminLayout /></Suspense>
                }>
                  <Route index element={
                    <Suspense fallback={<PageSkeleton />}><DashboardPage /></Suspense>
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
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </ErrorBoundary>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
