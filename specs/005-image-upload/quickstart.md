# Quickstart: Image Upload Validation

## Prerequisites

- Dev server running: `npm run dev`
- Logged in as admin (`admin@lionsclub.com` / `admin123`)

## Validation Scenarios

### US1 — Admin uploads event image

1. Navigate to `/admin/events/new`
2. Verify a **file upload area** is visible (labeled "Event Image")
3. Select a `.png`, `.jpg`, or `.webp` file
4. Verify a **preview thumbnail** appears
5. Fill in other required fields and submit
6. Verify redirect to `/admin/events`
7. Navigate to `/events` — verify the **card image** is displayed on the event card
8. Click the event — verify the **hero image** is displayed prominently

### US2 — Admin uploads member avatar

1. Navigate to `/admin/members/new`
2. Verify a **file upload area** is visible (labeled "Avatar"), styled as a **circle**
3. Select an image file
4. Verify a **circular preview thumbnail** appears
5. Fill in other required fields and submit
6. Navigate to `/about` — verify the **circular avatar** appears on the member card

### US3 — Image validation and error handling

1. On either form, select a non-image file (e.g., `.pdf`, `.txt`)
2. Verify error: **"Please select a valid image file (PNG, JPG, WebP)"**
3. Select an image larger than 5MB
4. Verify error: **"File size must be under 5MB"**
5. Verify the **submit button remains functional** (validation does not break form)

### Edge cases

- **Edit without changing image**: Navigate to edit an existing event/member with an image, change a text field, submit — verify the existing image persists
- **Remove image**: On edit form with existing image, click the **"X" remove button** on the preview, submit — verify the image is cleared
- **Loading state**: Submit the form with a large file (or slow network simulation) — verify a **spinner** appears on the upload field during submission
