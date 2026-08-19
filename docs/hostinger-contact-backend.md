# Hostinger backend: deployment and acceptance checklist

This project now ships one Node.js application: Express serves the compiled
Vite site and handles contact, newsletter and scheduling APIs on the same
domain. MySQL stores leads, subscriber consent, booking state, slot locks,
idempotency keys and delivery state. Google Calendar remains the external
source of truth for studio free/busy data and attendee invitations.

## What is already implemented

- Shared browser/server enums and field validation.
- Origin enforcement and an invisible honeypot.
- HMAC-hashed IP/email keys and atomic MySQL rate counters.
- A 5 MB upload ceiling plus extension and binary-signature validation for JPG,
  JPEG, PNG, WEBP, PDF, DOC and DOCX.
- Transactional insertion of the submission, optional attachment and pending
  notification before any identifier is returned.
- Hostinger SMTP notification with `sent` or `failed` delivery tracking and an
  8-second default ceiling.
- Health endpoints at `/api/health` and `/api/ready`.
- Automatic, locked and idempotent schema migrations.
- Double opt-in newsletter persistence with opaque verification and anonymous
  unsubscribe links.
- A single in-memory scheduler UI that never puts personal data in a URL.
- Server-owned availability rules, MySQL slot locks and transactional booking
  idempotency.
- Dedicated Google Calendar free/busy checks, deterministic event IDs, unique
  Google Meet rooms and attendee updates.
- Branded booking confirmation email plus opaque cancellation and rescheduling
  links.
- Strict Helmet/CSP security headers and structured logs that redact personal
  data, secrets, authorization values and token query parameters.
- AES-256-GCM encrypted `email_outbox` retry jobs with bounded exponential
  backoff and terminal dead-letter status.
- A bearer-protected, POST-only `/api/internal/maintenance` endpoint with a
  MySQL overlap lock, audit rows, rate-limit cleanup, attachment purge and data
  retention.

The schemas are in `server/db/migrations/001_contact_journey.sql`,
`002_newsletter.sql`, `003_scheduler.sql` and `004_security_operations.sql`.
Runtime settings are documented in [`.env.example`](../.env.example).
Daily cron, mail DNS, incident response and restore drills are documented in
[the security and operations runbook](security-operations-runbook.md).

## What the site owner must do

1. Confirm the Hostinger plan supports a server-side Node.js web app. Hostinger
   currently lists Business Web Hosting and Cloud plans for managed Node.js and
   supports Express with Node 22 and 24. Select **Node 24** for this project.
2. In hPanel, open **Databases → MySQL Databases**. Create a database, database
   user and strong password. Keep the exact database name, user and password.
3. In hPanel, create or choose a Hostinger Email mailbox that the website may
   send from, for example `website@your-domain.com`. Keep its full address and
   mailbox password. This can be the sending mailbox while
   `CONTACT_TO_EMAIL` points at the studio inbox.
4. Generate the rate-limit, maintenance and outbox-encryption secrets locally
   with separate `openssl rand -hex 32` commands. Treat each like a password
   and never reuse them.
5. Copy `.env.example`, replace every placeholder, and import the values during
   Node.js deployment. Never commit the completed `.env` file. `APP_ORIGIN`
   must be the exact public origin, such as `https://roughnote.in`; put the
   `www` form in `ALLOWED_ORIGINS` only if that form is actually used.
6. Set the scheduler rules in Hostinger. The supplied values mean Monday to
   Friday, 10:00–17:00 Asia/Kolkata, 30-minute meetings, at least 60 minutes of
   lead time, and a 60-day booking horizon. Keep
   `SCHEDULER_TIMEZONE=Asia/Kolkata` paired with
   `SCHEDULER_UTC_OFFSET_MINUTES=330`; this implementation intentionally uses
   that fixed, non-DST timezone.
7. Complete the Google Calendar authorization procedure below, then add the
   resulting Google values as Hostinger secrets. Never put them in Git.
8. Add the project as **Deploy Web App** using the Git repository or a ZIP. Use:
   - Framework: **Express.js** (or **Other** if detection asks)
   - Node version: **24.x**
   - Install: `npm ci`
   - Build: `npm run build`
   - Start: `npm start`
   - Entry file, if requested: `dist-server/server/index.js`
   - Output directory, if requested for “Other”: leave the detected value; the
     start script is authoritative because it serves both `dist` and
     `dist-server`.
9. Keep `DB_AUTO_MIGRATE=true`. On startup the app takes a MySQL advisory lock,
   applies each missing migration once, verifies the database connection, and
   only then starts accepting traffic.
10. After deployment, open `/api/health` and `/api/ready` on the live domain.
   Both must return HTTP 200 before testing the form.
11. Submit one genuine contact request from the live contact page. Do not test
   production with confidential material; a tiny PDF or image is enough.
12. Confirm the message arrives in the studio inbox, including the spam folder.
    The uploaded file is intentionally not attached to email; it remains in
    MySQL and the email contains its stored filename and size.
13. Subscribe a real studio-controlled email address in the footer. Open the
    verification link, confirm the row becomes `active`, then use the anonymous
    unsubscribe link once.
14. Book the next available online slot. Confirm the same booking identifier is
    present in MySQL, exactly one event appears on the dedicated calendar, its
    attendee is the submitted address, a unique Meet URL exists, and the
    branded SMTP confirmation arrives.
15. Complete every owner action in the security and operations runbook: publish
    SPF/DKIM/DMARC, schedule the daily protected cron, confirm a completed
    `maintenance_runs` row, enable/verify daily backups, download an encrypted
    external copy and perform an isolated restore drill.

## One-time Google Calendar and OAuth setup

1. In Google Calendar on a computer, create a separate calendar named
   **Rough Note Bookings**. Keep it private. In **Settings and sharing →
   Integrate calendar**, copy its Calendar ID into `GOOGLE_CALENDAR_ID`.
2. In Google Cloud Console, create/select the production project, enable the
   **Google Calendar API**, and configure the Google Auth Platform branding,
   audience and contact email.
3. Prefer an **Internal** OAuth app when the calendar owner belongs to your
   Google Workspace organization. If the app is External, do not leave the
   production credential in **Testing**: Google limits most Testing refresh
   tokens to seven days.
4. Create an OAuth 2.0 client of type **Web application** named
   `Rough Note Calendar Backend`. Add this exact authorized redirect URI:
   `http://127.0.0.1:53682/oauth/callback`.
5. On your own computer, from this project directory, run:

   ```sh
   GOOGLE_CLIENT_ID='your-client-id' \
   GOOGLE_CLIENT_SECRET='your-client-secret' \
   npm run calendar:authorize
   ```

6. Open the printed Google URL, sign in as the owner of the dedicated calendar,
   verify the requested Calendar permission, and approve once. The local helper
   checks OAuth `state`, exchanges the code, and prints the refresh token only
   in your terminal.
7. Add `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN` and
   `GOOGLE_CALENDAR_ID` to Hostinger environment secrets. Delete any shell
   history line that contained the client secret. Do not add the refresh token
   to `.env.example` or any committed file.
8. Deploy, then add a manual private event to the dedicated calendar during a
   future studio-hours slot. `/api/availability?date=YYYY-MM-DD` must omit every
   30-minute slot overlapped by that event. Remove the test event afterward.

The backend requests offline Calendar access, refreshes short-lived access
tokens server-side, and never returns either credential to the browser.

Google references used by this implementation:

- [Create a dedicated Google calendar](https://support.google.com/calendar/answer/37095)
- [Enable the Calendar API and configure OAuth](https://developers.google.com/workspace/calendar/api/quickstart/nodejs)
- [OAuth web-server offline access and refresh tokens](https://developers.google.com/identity/protocols/oauth2/web-server)
- [Calendar free/busy query](https://developers.google.com/workspace/calendar/api/v3/reference/freebusy/query)
- [Create events, attendee updates and Meet conferences](https://developers.google.com/workspace/calendar/api/guides/create-events)

Hostinger's current documentation confirms the supported Node.js deployment
flow and versions, `localhost:3306` for a same-account MySQL database, hPanel
environment-variable import, and `smtp.hostinger.com` with SSL port 465:

- [Deploy a Node.js web app on Hostinger](https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/)
- [Connect Hostinger MySQL to Node.js](https://www.hostinger.com/support/connecting-a-hostinger-mysql-database-to-a-node-js-application/)
- [Add Node.js environment variables](https://www.hostinger.com/support/how-to-add-environment-variables-during-node-js-application-deployment/)
- [Hostinger Email SMTP settings](https://www.hostinger.com/support/1575756-how-to-get-email-account-configuration-details-for-hostinger-email/)

## Live acceptance gate

In phpMyAdmin, run these read-only queries after the real form submission:

```sql
SELECT submission_id, contact_name, email, solution_type, received_at
FROM contact_submissions
ORDER BY received_at DESC
LIMIT 5;
```

```sql
SELECT s.submission_id,
       n.delivery_status,
       n.attempt_count,
       n.provider_message_id,
       n.error_message,
       n.sent_at
FROM contact_submissions AS s
JOIN contact_notifications AS n USING (submission_id)
ORDER BY s.received_at DESC
LIMIT 5;
```

```sql
SELECT submission_id, original_file_name, detected_mime, byte_size,
       HEX(sha256) AS sha256
FROM contact_attachments
ORDER BY created_at DESC
LIMIT 5;
```

The phase is accepted only when all of these are true for the same live request:

- The browser receives a nonempty `submissionId` beginning with `rn_`.
- `contact_submissions` contains that exact identifier.
- If a file was used, `contact_attachments` contains the same identifier and
  correct verified type and size.
- `contact_notifications.delivery_status` is `sent`.
- The notification is present in the studio mailbox.

If the submission exists but delivery is `failed`, the lead is safe. Correct
the SMTP values in hPanel, redeploy, and retain the database row for a later
retry workflow; do not ask the visitor to submit again.

### Newsletter checks

```sql
SELECT subscriber_id, email, subscription_status, source,
       subscription_requested_at, consent_confirmed_at, unsubscribed_at
FROM newsletter_subscribers
ORDER BY updated_at DESC
LIMIT 10;
```

```sql
SELECT subscriber_id, event_type, source, event_at
FROM newsletter_consent_events
ORDER BY event_at DESC
LIMIT 20;
```

The footer request first creates `pending`; clicking verification changes it to
`active` and records `consent_confirmed_at`; anonymous unsubscribe changes it
to `unsubscribed`. Repeating subscribe or unsubscribe must not add another
subscriber row.

### Booking, Calendar and Meet checks

```sql
SELECT booking_id, booking_status, starts_at, ends_at, contact_name, email,
       google_event_id, meeting_url, confirmation_delivery_status, created_at
FROM bookings
ORDER BY created_at DESC
LIMIT 10;
```

```sql
SELECT starts_at, ends_at, booking_id, lock_kind
FROM booking_slot_locks
ORDER BY starts_at;
```

For one online acceptance booking, require all of the following:

- The browser received `status=confirmed`, one `bookingId`, and one Meet URL.
- MySQL contains exactly one row for that ID and one `current` slot lock.
- The dedicated Google Calendar contains exactly one event with the same time,
  submitted attendee and Meet URL.
- The attendee received Google's invitation and the branded Rough Note email.
- Retrying the same HTTP request with the same `Idempotency-Key` returns the
  same identifier without another row, event, Meet room or branded email.
- A second key cannot book the slot; past and off-grid times return HTTP 409.
- The opaque management link cancels without login and removes the slot lock;
  rescheduling updates the same database row and Google event.

## Local rehearsal before deployment

Create a real `.env` file from `.env.example` using a disposable MySQL database
and mailbox, then run these in separate terminals:

```sh
npm run dev:api
npm run dev
```

Open `http://127.0.0.1:8000/html/contact.html`. The Vite development server
proxies `/api` to Express. For a production-shaped rehearsal, run:

```sh
npm run build
npm start
```

Then open `http://127.0.0.1:3000/html/contact.html` after changing the local
`APP_ORIGIN` accordingly.
