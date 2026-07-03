# RSVP API Contract

## Endpoint

`POST /events/:id/rsvp`

### Request

```json
{}
```

- No body required. User identity inferred from session cookie.

### Response (200)

```json
{
  "success": true,
  "rsvpCount": 12
}
```

- `rsvpCount`: Updated total count of RSVPs for the event

### Response (401)

```json
{
  "error": "Authentication required"
}
```

### Response (404)

```json
{
  "error": "Event not found"
}
```

## Event Data Augmentation

The existing `GET /events/:id` response is augmented with two new fields:

```json
{
  "id": "event-1",
  "title": "...",
  "description": "...",
  "date": "...",
  "time": "...",
  "location": "...",
  "category": "...",
  "status": "upcoming",
  "rsvpCount": 12,
  "hasRsvpd": false
}
```

### New Fields

| Field | Type | Description |
|-------|------|-------------|
| rsvpCount | number | Total number of RSVPs for this event |
| hasRsvpd | boolean | Whether the currently authenticated user has RSVP'd |
