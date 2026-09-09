import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enCommon from "./locales/en/common.json";
import enAuth from "./locales/en/auth.json";
import enEvents from "./locales/en/events.json";
import enForum from "./locales/en/forum.json";
import enProfile from "./locales/en/profile.json";
import enAdmin from "./locales/en/admin.json";
import enErrors from "./locales/en/errors.json";
import enNews from "./locales/en/news.json";
import enGallery from "./locales/en/gallery.json";
import enMembers from "./locales/en/members.json";
import enContact from "./locales/en/contact.json";
import enAbout from "./locales/en/about.json";
import enSearch from "./locales/en/search.json";

import frCommon from "./locales/fr/common.json";
import frAuth from "./locales/fr/auth.json";
import frEvents from "./locales/fr/events.json";
import frForum from "./locales/fr/forum.json";
import frProfile from "./locales/fr/profile.json";
import frAdmin from "./locales/fr/admin.json";
import frErrors from "./locales/fr/errors.json";
import frNews from "./locales/fr/news.json";
import frGallery from "./locales/fr/gallery.json";
import frMembers from "./locales/fr/members.json";
import frContact from "./locales/fr/contact.json";
import frAbout from "./locales/fr/about.json";
import frSearch from "./locales/fr/search.json";

import arCommon from "./locales/ar/common.json";
import arAuth from "./locales/ar/auth.json";
import arEvents from "./locales/ar/events.json";
import arForum from "./locales/ar/forum.json";
import arProfile from "./locales/ar/profile.json";
import arAdmin from "./locales/ar/admin.json";
import arErrors from "./locales/ar/errors.json";
import arNews from "./locales/ar/news.json";
import arGallery from "./locales/ar/gallery.json";
import arMembers from "./locales/ar/members.json";
import arContact from "./locales/ar/contact.json";
import arAbout from "./locales/ar/about.json";
import arSearch from "./locales/ar/search.json";

export const defaultNS = "common";
export const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    events: enEvents,
    forum: enForum,
    profile: enProfile,
    admin: enAdmin,
    errors: enErrors,
    news: enNews,
    gallery: enGallery,
    members: enMembers,
    contact: enContact,
    about: enAbout,
    search: enSearch,
  },
  fr: {
    common: frCommon,
    auth: frAuth,
    events: frEvents,
    forum: frForum,
    profile: frProfile,
    admin: frAdmin,
    errors: frErrors,
    news: frNews,
    gallery: frGallery,
    members: frMembers,
    contact: frContact,
    about: frAbout,
    search: frSearch,
  },
  ar: {
    common: arCommon,
    auth: arAuth,
    events: arEvents,
    forum: arForum,
    profile: arProfile,
    admin: arAdmin,
    errors: arErrors,
    news: arNews,
    gallery: arGallery,
    members: arMembers,
    contact: arContact,
    about: arAbout,
    search: arSearch,
  },
} as const;

export const supportedLngs = ["en", "fr", "ar"] as const;
export type SupportedLng = (typeof supportedLngs)[number];

if (!i18n.isInitialized) {
  void i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      defaultNS,
      fallbackNS: "common",
      fallbackLng: "en",
      supportedLngs,
      detection: {
        order: ["localStorage", "cookie", "navigator"],
        caches: ["localStorage", "cookie"],
        lookupLocalStorage: "i18nextLng",
        lookupCookie: "i18nextLng",
        cookieOptions: { path: "/", sameSite: "strict" },
      },
      interpolation: {
        escapeValue: false,
      },
      returnEmptyString: false,
    });

  const updateHtmlAttrs = (lng: string) => {
    const dir = i18n.dir(lng);
    if (typeof document !== "undefined") {
      document.documentElement.lang = lng;
      document.documentElement.dir = dir;
      document.documentElement.setAttribute("dir", dir);
    }
  };

  if (typeof document !== "undefined") {
    updateHtmlAttrs(i18n.language ?? "en");
  }

  i18n.on("languageChanged", updateHtmlAttrs);
}

export default i18n;
