import type { ForumCategory, ForumThread, ForumReply } from "@/types";

export const categories: ForumCategory[] = [
  {
    id: "cat-1",
    name: "General Discussion",
    description: "General conversations about club activities and community news.",
    threadCount: 24,
    postCount: 156,
    icon: "MessageSquare",
  },
  {
    id: "cat-2",
    name: "Events & Projects",
    description: "Discuss upcoming and past events, share ideas for new projects.",
    threadCount: 18,
    postCount: 98,
    icon: "Calendar",
  },
  {
    id: "cat-3",
    name: "Members Corner",
    description: "A space for members to connect, share updates, and collaborate.",
    threadCount: 12,
    postCount: 67,
    icon: "Users",
  },
  {
    id: "cat-4",
    name: "Suggestions & Feedback",
    description: "Share your ideas to improve the club and its initiatives.",
    threadCount: 9,
    postCount: 43,
    icon: "Lightbulb",
  },
];

export const threads: ForumThread[] = [
  {
    id: "thread-1",
    categoryId: "cat-1",
    title: "Welcome to the new Lions Club FSBM Forum!",
    author: "Ahmed Benali",
    content:
      "Welcome everyone to our brand new community forum! This is a space for all members to connect, share ideas, and stay updated on club activities. Please introduce yourselves here!",
    createdAt: "2026-01-15T10:00:00Z",
    status: "pinned",
    replyCount: 12,
    viewCount: 234,
    lastActivity: "2026-06-20T14:30:00Z",
  },
  {
    id: "thread-2",
    categoryId: "cat-2",
    title: "Ideas for the next fundraising event",
    author: "Karim Othmani",
    content:
      "We're brainstorming ideas for our next fundraising event. I'd love to hear everyone's suggestions. Some ideas we've considered: a charity run, a book sale, or a cultural night. What do you think?",
    createdAt: "2026-06-10T09:00:00Z",
    status: "normal",
    replyCount: 8,
    viewCount: 89,
    lastActivity: "2026-06-22T11:00:00Z",
  },
  {
    id: "thread-3",
    categoryId: "cat-3",
    title: "New member introductions",
    author: "Nadia Benkirane",
    content:
      "Hello everyone! I'm Nadia, the new Treasurer. I'm excited to be part of this amazing club. Looking forward to working with all of you to make a difference in our community!",
    createdAt: "2026-05-20T15:00:00Z",
    status: "normal",
    replyCount: 5,
    viewCount: 67,
    lastActivity: "2026-05-25T10:00:00Z",
  },
];

export const replies: ForumReply[] = [
  {
    id: "reply-1",
    threadId: "thread-1",
    author: "Fatima Zahra El Amrani",
    content:
      "Thank you Ahmed! This is a great initiative. Looking forward to engaging with everyone here.",
    createdAt: "2026-01-15T11:00:00Z",
  },
  {
    id: "reply-2",
    threadId: "thread-1",
    author: "Youssef Idrissi",
    content:
      "Excited to be part of this new platform. The forum looks great!",
    createdAt: "2026-01-16T09:00:00Z",
    parentReplyId: "reply-1",
  },
  {
    id: "reply-3",
    threadId: "thread-2",
    author: "Salma Bouazza",
    content:
      "A cultural night sounds fantastic! We could feature Moroccan music, food, and traditional crafts. It would be a great way to celebrate our heritage while raising funds.",
    createdAt: "2026-06-10T14:00:00Z",
  },
];