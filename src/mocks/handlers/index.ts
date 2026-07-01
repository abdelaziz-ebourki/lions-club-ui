import { eventHandlers } from "./events";
import { memberHandlers } from "./members";
import { forumHandlers } from "./forum";
import { contactHandlers } from "./contact";
import { authHandlers } from "./auth";
import { searchHandlers } from "./search";

export const handlers = [
  ...eventHandlers,
  ...memberHandlers,
  ...forumHandlers,
  ...contactHandlers,
  ...authHandlers,
  ...searchHandlers,
];
