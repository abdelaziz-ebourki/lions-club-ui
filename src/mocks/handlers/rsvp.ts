import { http, HttpResponse } from "msw";
import { withRealisticDelay } from "../utils";
import { events } from "../data/events";

interface RsvpRecord {
  id: string;
  eventId: string;
  memberId: string;
  status: string;
  createdAt: string;
}

const rsvps: RsvpRecord[] = [];

export const rsvpHandlers = [
  http.post("/api/events/:eventId/rsvp", async ({ params, request, cookies }) => {
    await withRealisticDelay();
    const authToken = (cookies as Record<string, string>)["auth_token"];
    if (!authToken) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const eventId = params.eventId as string;
    const event = events.find((e) => e.id === eventId);
    if (!event) {
      return HttpResponse.json({ message: "Event not found" }, { status: 404 });
    }
    let body: Record<string, unknown>;
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      body = {};
    }
    const status = (body.status as string) ?? "YES";
    // upsert
    const existingIdx = rsvps.findIndex((r) => r.eventId === eventId && r.memberId === authToken);
    if (existingIdx !== -1) {
      rsvps[existingIdx].status = status;
      return HttpResponse.json(
        {
          id: rsvps[existingIdx].id,
          eventId,
          memberId: authToken,
          status,
          createdAt: rsvps[existingIdx].createdAt,
        },
        { status: 201 }
      );
    }
    const newRsvp: RsvpRecord = {
      id: `rsvp-${Date.now()}`,
      eventId,
      memberId: authToken,
      status,
      createdAt: new Date().toISOString(),
    };
    rsvps.push(newRsvp);
    // mutate event rsvpCount for prototype display
    const anyEvent = event as unknown as Record<string, unknown>;
    const current = typeof anyEvent["rsvpCount"] === "number" ? (anyEvent["rsvpCount"] as number) : 0;
    anyEvent["rsvpCount"] = current + 1;
    anyEvent["hasRsvpd"] = true;
    return HttpResponse.json(
      {
        id: newRsvp.id,
        eventId,
        memberId: authToken,
        status,
        createdAt: newRsvp.createdAt,
      },
      { status: 201 }
    );
  }),

  http.get("/api/events/:eventId/rsvps", async ({ params }) => {
    await withRealisticDelay();
    const eventId = params.eventId as string;
    const filtered = rsvps.filter((r) => r.eventId === eventId);
    return HttpResponse.json(filtered);
  }),
];
