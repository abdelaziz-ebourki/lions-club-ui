import { http, HttpResponse } from "msw";
import { withRealisticDelay } from "../utils";
import { contactMessages } from "../data/contact";

export const contactHandlers = [
  http.get("/api/contact", async () => {
    await withRealisticDelay();
    return HttpResponse.json(contactMessages);
  }),

  http.post("/api/contact", async ({ request }) => {
    await withRealisticDelay();
    const body = (await request.json()) as Record<string, unknown>;
    const newMessage = {
      id: `msg-${Date.now()}`,
      name: body.name as string,
      email: body.email as string,
      subject: body.subject as string,
      message: body.message as string,
      createdAt: new Date().toISOString(),
      status: "unread" as const,
    };
    contactMessages.unshift(newMessage);
    return HttpResponse.json(newMessage, { status: 201 });
  }),

  http.patch("/api/contact/:id", async ({ params }) => {
    await withRealisticDelay();
    const msg = contactMessages.find((m) => m.id === params.id);
    if (!msg) return new HttpResponse(null, { status: 404 });
    msg.status = "read";
    return HttpResponse.json(msg);
  }),

  http.delete("/api/contact/:id", async ({ params }) => {
    await withRealisticDelay();
    const idx = contactMessages.findIndex((m) => m.id === params.id);
    if (idx === -1) return new HttpResponse(null, { status: 404 });
    contactMessages.splice(idx, 1);
    return HttpResponse.json({ success: true });
  }),
];