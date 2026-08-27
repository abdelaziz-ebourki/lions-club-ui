import { eventHandlers } from "./events";
import { memberHandlers } from "./members";
import { forumHandlers } from "./forum";
import { contactHandlers } from "./contact";
import { authHandlers } from "./auth";
import { searchHandlers } from "./search";
import { notificationHandlers } from "./notifications";
import { emailVerificationHandlers } from "./email-verification";
import { sessionHandlers } from "./session";
import { profileHandlers } from "./profile";
import { newsHandlers } from "./news";
import { galleryHandlers } from "./gallery";

export const handlers = [
  ...eventHandlers,
  ...memberHandlers,
  ...forumHandlers,
  ...contactHandlers,
  ...authHandlers,
  ...searchHandlers,
  ...notificationHandlers,
  ...emailVerificationHandlers,
  ...sessionHandlers,
  ...profileHandlers,
  ...newsHandlers,
  ...galleryHandlers,
];
