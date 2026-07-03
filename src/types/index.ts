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
  parentReplyId?: string;
}

export type EntityType = "event" | "forum_thread" | "member" | "contact_message";

export interface SearchQuery {
  raw: string;
  sanitized: string;
  length: number;
  isEmpty: boolean;
}

export interface SearchResult {
  id: string;
  entityType: EntityType;
  title: string;
  snippet: string;
  url: string;
  matchType: "exact" | "partial";
  updatedAt: string;
}

export interface SearchResultGroup {
  entityType: EntityType;
  label: string;
  count: number;
  results: SearchResult[];
}

