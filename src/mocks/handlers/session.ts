import { http, HttpResponse } from "msw";
import { withRealisticDelay } from "../utils";

export const sessionHandlers = [
  http.all("/api/session/expired", async () => {
    await withRealisticDelay();
    return HttpResponse.json(
      { error: "Session expired", code: "SESSION_EXPIRED" },
      { status: 401 }
    );
  }),
];