export const siteConfig = {
  name: "Lions Club FSBM",
  tagline: "We Serve",
  description:
    "Lions Club FSBM is a community of dedicated volunteers serving the greater Casablanca area since 2015.",
  email: "contact@lionsclubfsbm.org",
  phone: "+212 5XX-XXXXXX",
  address: "Casablanca, Morocco",
  social: {
    facebook: "https://facebook.com/lionsclubfsbm",
    instagram: "https://instagram.com/lionsclubfsbm",
    linkedin: "https://linkedin.com/company/lionsclubfsbm",
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Events", href: "/events" },
    { label: "Forum", href: "/forum" },
    { label: "Contact", href: "/contact" },
  ],
};

export const appConfig = {
  apiBaseUrl: import.meta.env.VITE_API_URL ?? "/api",
} as const;
