# Rough Note security and operations runbook

This runbook covers the Hostinger production runtime introduced in Phase 6. It
contains no live credentials. Keep the completed values only in hPanel secrets
and the studio password manager.

## 1. Production settings

Generate two different values locally:

```sh
openssl rand -hex 32
openssl rand -hex 32
```

Put one in `MAINTENANCE_SECRET` and the other in
`OUTBOX_ENCRYPTION_KEY`. Never reuse the database, SMTP, rate-limit, OAuth or
maintenance secrets. Changing `OUTBOX_ENCRYPTION_KEY` without first draining
the outbox makes existing pending messages unreadable, so key rotation needs a
planned drain-and-deploy window.

Deploy with the retention defaults in [`.env.example`](../.env.example). The
application sends strict CSP, HSTS, clickjacking, MIME-sniffing, referrer and
Permissions Policy headers. Its CSP permits only same-origin scripts, the
current Google Fonts styles/fonts, same-origin and data/blob images, and the
inline styles currently used by the React pages. It does not permit inline
scripts.

Application logs are structured events. They deliberately omit bodies,
headers, email addresses, names, raw IP addresses, OAuth values and URL query
strings. Search by `X-Request-ID` and event code instead of personal details.

## 2. hPanel daily maintenance cron

After the new migration has run, test the endpoint once from a trusted terminal:

```sh
curl --fail --silent --show-error --request POST \
  --header 'Authorization: Bearer REPLACE_WITH_MAINTENANCE_SECRET' \
  https://roughnote.in/api/internal/maintenance
```

The secret is in an HTTP header, never the URL. A successful response has
`status: "completed"` and deletion/retry counts. `401` means the header and
hPanel secret differ; `409` means another maintenance run holds the MySQL lock;
`500` means the run failed and needs investigation.

In hPanel, open **Websites → Dashboard → Advanced → Cron Jobs** and schedule the
same `curl` POST once a day, for example at 02:15 in the hosting account's
timezone. Use a 64-character hexadecimal secret so shell metacharacters are not
needed. If hPanel rejects a command with quoting or redirection, put the command
in a permission-restricted `.sh` file outside `public_html` and schedule that
file; do not make the script web-accessible.

Verify the first scheduled run in phpMyAdmin without exposing personal data:

```sql
SELECT maintenance_run_id, run_status, rate_limits_deleted,
       attachments_deleted, outbox_sent, outbox_failed,
       started_at, finished_at, error_code
FROM maintenance_runs
ORDER BY maintenance_run_id DESC
LIMIT 10;
```

The run expires old rate counters, removes attachment blobs, applies the
published contact/booking/newsletter retention windows, deletes expired outbox
records and retries due email. A MySQL advisory lock prevents overlapping runs.

## 3. Email outbox incidents

Email payloads—including verification and management links—are encrypted with
AES-256-GCM in `email_outbox`. Retry starts at five minutes, doubles after each
failure up to one day, and stops after six attempts by default.

Inspect only operational columns:

```sql
SELECT outbox_id, message_kind, delivery_status, attempt_count, max_attempts,
       next_attempt_at, error_code, created_at, sent_at
FROM email_outbox
ORDER BY outbox_id DESC
LIMIT 50;
```

For SMTP failures:

1. Check Hostinger Email mailbox status and storage, then verify `SMTP_HOST`,
   port, secure mode, user, password and `MAIL_FROM` in hPanel.
2. Run `EMAIL_DOMAIN=roughnote.in npm run ops:check-email-dns` from a network
   with normal DNS access.
3. Send one mailbox-to-mailbox test from Hostinger Webmail.
4. Trigger maintenance once. Confirm the outbox row becomes `sent` and the
   matching contact/newsletter/booking delivery status updates.
5. If a row is `dead`, fix the cause first. Then reset only the reviewed row:

   ```sql
   UPDATE email_outbox
   SET delivery_status = 'pending', attempt_count = 0,
       next_attempt_at = UTC_TIMESTAMP(3), locked_at = NULL,
       error_code = NULL, error_summary = NULL
   WHERE outbox_id = REPLACE_WITH_REVIEWED_ID AND delivery_status = 'dead';
   ```

Never copy or decrypt `payload_ciphertext` for routine diagnosis. SMTP cannot
offer a database transaction with email delivery, so a timeout at the exact
moment the provider accepts a message can rarely create a duplicate. Check the
recipient mailbox before manually resetting a timed-out row.

## 4. Google Calendar and Meet incidents

Use the event codes `availability_lookup_failed`,
`calendar_event_provision_failed`, `calendar_cancellation_failed`,
`reschedule_freebusy_failed` and `calendar_reschedule_failed`.

For free/busy or event creation failures:

1. Confirm the Google Calendar API is enabled, the refresh token has not been
   revoked, and `GOOGLE_CALENDAR_ID` is still the dedicated Rough Note calendar.
2. Confirm the OAuth user can edit that calendar. For an External OAuth app,
   verify it was not left in Testing with a short-lived refresh token.
3. Open the dedicated calendar and search for the booking time. Event creation
   uses a deterministic external event ID, so retrying the original booking
   request with the same `Idempotency-Key` will reconcile rather than create a
   second event.
4. A failed initial provision leaves `booking_status='pending_calendar'` and
   keeps the MySQL slot lock. Do not delete it while Google state is uncertain.
   Ask the visitor to use the same browser retry, or reconcile the calendar
   first and escalate to a developer with the booking ID.
5. Cancellation releases the database slot only after Google deletion
   succeeds. Rescheduling reserves the new slot transactionally and rolls it
   back when Google fails before updating. If Google updated but the database
   finalization failed, stop automated changes and compare the one database row,
   both slot locks and the Google event before correction.

Do not log or paste attendee addresses, Meet links, management links, OAuth
responses or refresh tokens into tickets.

## 5. SPF, DKIM and DMARC

For Hostinger Mail, publish the records displayed in **Emails → Mailboxes →
Domain settings**. The documented defaults are:

- one root TXT SPF record containing
  `v=spf1 include:_spf.mail.hostinger.com ~all`;
- three DKIM CNAMEs named `hostingermail-a._domainkey`,
  `hostingermail-b._domainkey`, and `hostingermail-c._domainkey`, pointing to
  the corresponding `*.dkim.mail.hostinger.com` targets;
- one `_dmarc` TXT record. Start with
  `v=DMARC1; p=none; rua=mailto:dmarc@roughnote.in`, review reports, then move
  to `quarantine` and ultimately `reject` once every legitimate sender aligns.

There must be only one SPF record. Merge any other legitimate sender into it;
do not publish a second `v=spf1` TXT record. DNS propagation can take up to 24
hours. Run the repository DNS check after propagation.

## 6. Backups and restore drill

Hostinger currently provides weekly backups for web/cloud plans. Business and
greater plans include daily backups retained for seven days; weekly copies are
retained for six weeks. In hPanel, open **Websites → Dashboard → Backups** and
confirm a current database backup is visible after every material migration.

At least monthly, download the database backup (`.sql.gz`) from **Restore and
download → Database backups**. Store it encrypted in a different provider or
offline encrypted drive with access limited to the studio owners. Keep the
external rolling set only as long as the documented recovery need (90 days is
the default operational target), then securely delete it. A backup contains
personal data even after live retention cleanup.

Run a restore drill at least quarterly:

1. Create a new disposable Hostinger database whose name contains `restore` or
   `recovery`. Never use the production database.
2. Import the downloaded `.sql.gz` through phpMyAdmin or Hostinger SSH.
3. Run the read-only repository check with `RESTORE_DB_HOST`,
   `RESTORE_DB_NAME`, `RESTORE_DB_USER`, `RESTORE_DB_PASSWORD` and optionally
   `RESTORE_DB_SSL=true`:

   ```sh
   npm run ops:verify-backup-restore
   ```

4. Record the backup timestamp, test date, operator, script result and recovery
   time in the private operations log—never the row contents.
5. Delete the disposable restored database in hPanel after the drill.

The Phase 6 gate is complete only after the live cron has a completed run, mail
DNS passes, a failed email has been retried in a non-production rehearsal, and
a real downloaded backup has passed the isolated restore drill.

## Official Hostinger references

- [Set up Hostinger Mail DNS records](https://www.hostinger.com/support/8650765-set-up-a-domain-for-hostinger-email/)
- [Set up a cron job](https://www.hostinger.com/support/hpanel/cron-jobs/)
- [Troubleshoot cron jobs](https://www.hostinger.com/support/1583514-troubleshooting-cron-jobs-at-hostinger/)
- [Download Hostinger backups](https://www.hostinger.com/support/5981435-how-to-download-backups-at-hostinger/)
- [Import and export MySQL databases](https://www.hostinger.com/support/mysql-databases/importing-and-exporting-databases/)
