export type EventStatus = "upcoming" | "ongoing" | "past";

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image?: string;
  category: string;
  status: EventStatus;
}

export type ForumThreadStatus = "active" | "pinned" | "locked" | "archived" | "normal";

export interface ForumThread {
  id: string;
  categoryId: string;
  title: string;
  author: string;
  content: string;
  createdAt: string;
  status: ForumThreadStatus;
  replyCount: number;
  viewCount: number;
  lastActivity: string;
}

export type ContactMessageStatus = "unread" | "read" | "archived";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status: ContactMessageStatus;
}

export interface Member {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  bio?: string;
  joinedAt: string;
}

export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  threadCount: number;
  postCount: number;
  icon: string;
}

export interface ForumReply {
  id: string;
  threadId: string;
  author: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PageMeta {
  title: string;
  description: string;
}

// Type guards for discriminated unions
export function isUpcomingEvent(event: Event): event is Event & { status: "upcoming" } {
  return event.status === "upcoming";
}

export function isPinnedThread(thread: ForumThread): thread is ForumThread & { status: "pinned" } {
  return thread.status === "pinned";
}

export function isLockedThread(thread: ForumThread): thread is ForumThread & { status: "locked" } {
  return thread.status === "locked";
}

export function isUnreadMessage(message: ContactMessage): message is ContactMessage & { status: "unread" } {
  return message.status === "unread";
}

// Exhaustive check helper
export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value}`);
}