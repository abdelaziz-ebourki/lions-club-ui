import type { ContactMessage } from "@/types";

export const contactMessages: ContactMessage[] = [
  {
    id: "msg-1",
    name: "Mohamed El Fassi",
    email: "mohamed@example.com",
    subject: "Volunteer Inquiry",
    message:
      "Hi, I'm interested in volunteering with Lions Club FSBM. Could you please send me information about upcoming events and how I can get involved?",
    createdAt: "2026-06-20T09:30:00Z",
    status: "unread",
  },
  {
    id: "msg-2",
    name: "Amina Tazi",
    email: "amina@example.com",
    subject: "Partnership Proposal",
    message:
      "I'm reaching out on behalf of our organization to discuss a potential partnership with Lions Club FSBM for our upcoming community development project in Casablanca.",
    createdAt: "2026-06-18T14:00:00Z",
    status: "read",
  },
];