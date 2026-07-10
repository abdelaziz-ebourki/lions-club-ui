import { http, HttpResponse } from "msw";
import { members } from "../data/members";
import { parseBody } from "../utils";

export const memberHandlers = [
  http.get("/api/members", () => {
    return HttpResponse.json(members);
  }),

  http.get("/api/members/:id", ({ params }) => {
    const member = members.find((m) => m.id === params.id);
    if (!member) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(member);
  }),

  http.post("/api/members", async ({ request }) => {
    const body = await parseBody(request);
    const newMember = {
      id: `member-${Date.now()}`,
      name: body.name as string,
      role: (body.role as string) ?? "Member",
      bio: (body.bio as string) ?? "",
      avatar: (body.avatar as string) ?? undefined,
      joinedAt: new Date().toISOString().split("T")[0],
    };
    members.push(newMember);
    return HttpResponse.json(newMember, { status: 201 });
  }),

  http.put("/api/members/:id", async ({ params, request }) => {
    const idx = members.findIndex((m) => m.id === params.id);
    if (idx === -1) return new HttpResponse(null, { status: 404 });
    const body = await parseBody(request);
    members[idx] = { ...members[idx], ...body } as (typeof members)[number];
    return HttpResponse.json(members[idx]);
  }),

  http.delete("/api/members/:id", ({ params }) => {
    const idx = members.findIndex((m) => m.id === params.id);
    if (idx === -1) return new HttpResponse(null, { status: 404 });
    members.splice(idx, 1);
    return HttpResponse.json({ success: true });
  }),
];
