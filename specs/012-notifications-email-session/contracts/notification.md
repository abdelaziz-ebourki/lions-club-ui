# Notification API Contract

## Endpoints

### GET /api/notifications

Fetch notifications for the authenticated user. Polled at 30s intervals.

#### Query Parameters

| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| limit | number | No | 20 | Max notifications to return |
| unreadOnly | boolean | No | false | If true, only return unread notifications |

#### Response (200)

```json
{
  "notifications": [
    {
      "id": "notif-1",
      "type": "forum_reply",
      "title": "New reply in 'Event Planning'",
      "description": "Ahmed replied: 'I can help with venue setup'",
      "targetUrl": "/forum/cat-1/thread-42",
      "read": false,
      "createdAt": "2026-07-06T10:30:00Z"
    }
  ],
  "unreadCount": 1
}
```

#### Response (401)

```json
{
  "error": "Authentication required"
}
```

### PUT /api/notifications/:id/read

Mark a single notification as read.

#### Request

```json
{}
```

#### Response (200)

```json
{
  "success": true
}
```

### PUT /api/notifications/read-all

Mark all notifications as read.

#### Request

```json
{}
```

#### Response (200)

```json
{
  "success": true
}
```

## Notification Types

| Type | Icon | Target URL Pattern | Description |
|------|------|--------------------|-------------|
| `forum_reply` | MessageSquare | `/forum/:categoryId/:threadId` | Someone replied to a thread the user participated in |
| `event_update` | Calendar | `/events/:id` | Event date/location changed or new event announced |
| `admin_announcement` | Megaphone | `/announcements/:id` or `/` | System-wide message from admin |
