import { http, HttpResponse } from "msw";

export const sessionHandlers = [
  http.all("/api/session/expired", () => {
    return HttpResponse.json(
      { error: "Session expired", code: "SESSION_EXPIRED" },
      { status: 401 }
    );
  }),
];
