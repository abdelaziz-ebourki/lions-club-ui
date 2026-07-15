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
  rsvpCount?: number;
  hasRsvpd?: boolean;
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

export type NotificationType = "forum_reply" | "event_update" | "admin_announcement";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  targetUrl: string;
  read: boolean;
  createdAt: string;
}

export interface BreadcrumbSegment {
  label: string;
  href?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "admin" | "member";
  avatar?: string;
  createdAt: string;
  lastLoginIp?: string;
  accountStatus?: "active" | "suspended" | "disabled";
}

export interface PasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export class AuthError extends Error {
  constructor() {
    super("Session expired");
    this.name = "AuthError";
  }
}

