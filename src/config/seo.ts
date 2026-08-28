import type { SEOMetadata } from "@/types";
import { truncateDescription } from "@/lib/seo";

export const seoConfig: Record<string, SEOMetadata> = {
  home: {
    title: "Lions Club FSBM — Community Service in Casablanca",
    description:
      "Lions Club FSBM is a community service organization in Casablanca, Morocco. Join us in making a difference through service projects and events.",
    ogType: "website",
  },
  events: {
    title: "Events — Lions Club FSBM",
    description:
      "Browse upcoming and past community service events organized by Lions Club FSBM in Casablanca. Join us for volunteer projects, fundraisers, and community outreach.",
    ogType: "website",
  },
  forum: {
    title: "Forum — Lions Club FSBM",
    description:
      "Join the Lions Club FSBM forum to discuss community projects, events, and service initiatives in Casablanca.",
    ogType: "website",
  },
  about: {
    title: "About Us — Lions Club FSBM",
    description:
      "Learn about Lions Club FSBM's mission, history, and impact in Casablanca, Morocco. We serve our community through volunteer projects and events.",
    ogType: "website",
  },
  contact: {
    title: "Contact Us — Lions Club FSBM",
    description:
      "Get in touch with Lions Club FSBM in Casablanca. Reach us by email, phone, or visit us at our location.",
    ogType: "website",
  },
  login: {
    title: "Sign In — Lions Club FSBM",
    description:
      "Sign in to your Lions Club FSBM account to manage events, forum posts, and your profile.",
    ogType: "website",
  },
  register: {
    title: "Join Us — Lions Club FSBM",
    description:
      "Join Lions Club FSBM and become part of a community service organization making a difference in Casablanca, Morocco.",
    ogType: "website",
  },
  forgotPassword: {
    title: "Forgot Password — Lions Club FSBM",
    description: "Reset your Lions Club FSBM password. We'll send you a link to create a new password.",
    ogType: "website",
  },
  resetPassword: {
    title: "Reset Password — Lions Club FSBM",
    description: "Create a new password for your Lions Club FSBM account.",
    ogType: "website",
  },
  news: {
    title: "News — Lions Club FSBM",
    description:
      "Latest news and announcements from Lions Club FSBM in Casablanca. Stay updated with our community service stories and events.",
    ogType: "website",
  },
  gallery: {
    title: "Gallery — Lions Club FSBM",
    description:
      "Explore photos from Lions Club FSBM events, projects, and community service in Casablanca. Moments that matter.",
    ogType: "website",
  },
  members: {
    title: "Members — Lions Club FSBM",
    description: "Meet the dedicated members of Lions Club FSBM.",
    ogType: "website",
  },
  newThread: {
    title: "New Thread — Lions Club FSBM",
    description: "Create a new discussion thread in the Lions Club FSBM forum.",
    ogType: "website",
  },
  profile: {
    title: "Profile — Lions Club FSBM",
    description: "Your Lions Club FSBM profile and account settings.",
    ogType: "website",
    noindex: true,
  },
  verifyEmail: {
    title: "Verify Email — Lions Club FSBM",
    description: "Verify your email address for Lions Club FSBM.",
    ogType: "website",
    noindex: true,
  },
  admin: {
    title: "Admin — Lions Club FSBM",
    description: "Admin dashboard for Lions Club FSBM.",
    ogType: "website",
    noindex: true,
  },
  notFound: {
    title: "Page Not Found — Lions Club FSBM",
    description: "Page not found — Return to the Lions Club FSBM homepage.",
    ogType: "website",
  },
};

export function getEventSeo(event: { title: string; description: string; image?: string }): SEOMetadata {
  return {
    title: `${event.title} — Lions Club FSBM`,
    description: truncateDescription(event.description),
    image: event.image,
    ogType: "article",
  };
}

export function getCategorySeo(category: { name: string; description: string }): SEOMetadata {
  return {
    title: `${category.name} — Lions Club FSBM`,
    description: truncateDescription(category.description),
    ogType: "website",
  };
}

export function getThreadSeo(thread: { title: string; content: string }): SEOMetadata {
  return {
    title: `${thread.title} — Lions Club FSBM`,
    description: truncateDescription(thread.content),
    ogType: "article",
  };
}

export function getSearchSeo(query: string): SEOMetadata {
  const trimmed = query.trim();
  if (!trimmed) {
    return {
      title: "Search — Lions Club FSBM",
      description:
        "Search events, forum discussions, and members of Lions Club FSBM in Casablanca.",
      ogType: "website",
    };
  }
  return {
    title: `Search: ${trimmed} — Lions Club FSBM`,
    description: `Search results for ${trimmed} — find events, forum discussions, and members of Lions Club FSBM in Casablanca.`,
    ogType: "website",
  };
}

export function getMemberSeo(member: { name: string; role: string; bio?: string; avatar?: string }): SEOMetadata {
  return {
    title: `${member.name} — Lions Club FSBM`,
    description: member.bio ?? member.role,
    image: member.avatar,
    ogType: "profile",
  };
}

export function getNewsSeo(article: { title: string; excerpt: string; featuredImage?: string }): SEOMetadata {
  return {
    title: `${article.title} | Lions Club FSBM`,
    description: truncateDescription(article.excerpt || article.title),
    image: article.featuredImage,
    ogType: "article",
  };
}
