import { eventHandlers } from "./events";
import { memberHandlers } from "./members";
import { forumHandlers } from "./forum";
import { contactHandlers } from "./contact";
import { authHandlers } from "./auth";

export const handlers = [
  ...eventHandlers,
  ...memberHandlers,
  ...forumHandlers,
  ...contactHandlers,
  ...authHandlers,
];
