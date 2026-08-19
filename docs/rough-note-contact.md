# Rough Note contact journey

The Contact / Request for Quotation experience is mounted by
`src/app/entrypoints/contact.tsx`. `src/pages/contact/ContactPage.tsx` composes
the shared notebook layout, the contact journey and the drawing feature.

## Build and verify

```sh
npm install
npm run build
npm run validate
npx playwright test tests/e2e/rough-note-contact.spec.ts
```

The multi-page Vite build emits the complete site to `dist/`.

## Submission endpoint

The default endpoint is:

```text
POST /api/contact
```

Override it before the contact entrypoint runs:

```html
<script>
  window.ROUGH_NOTE_CONTACT_ENDPOINT =
    "https://example.com/api/contact";
</script>
```

Alternatively, change the page metadata:

```html
<meta
  name="rough-note-contact-endpoint"
  content="https://example.com/api/contact"
/>
```

The browser sends `multipart/form-data` with these fields:

| Field | Required | Notes |
| --- | --- | --- |
| `solutionType` | Yes | Selected solution category |
| `department` | Yes | Selected business area |
| `challengeText` | Yes | At least 15 non-whitespace characters |
| `name` | Yes | Contact name |
| `email` | Yes | Valid email address |
| `phone` | No | Contact phone |
| `website` | No | Website address |
| `role` | Yes | Selected role |
| `source` | Yes | Always `rough-note-contact-journey` |
| `companyAddress2` | No | Invisible anti-spam honeypot; humans leave it empty |
| `referenceFile` | No | JPG, JPEG, PNG, WEBP, PDF, DOC, or DOCX; maximum 5 MB |

The server must enforce the same validation, apply the project's rate limiting
or spam controls, and return JSON with a persistent confirmation identifier:

```json
{
  "submissionId": "rn_01J..."
}
```

`id` is also accepted as the identifier property. A successful HTTP status
without either identifier is treated as a failure, so the thank-you state is
never fabricated by the client.

For a rejected request, return a non-2xx status with either:

```json
{
  "message": "The request could not be accepted."
}
```

or:

```json
{
  "errors": {
    "email": "Enter a valid email address."
  }
}
```

Requests time out after 15 seconds. Failure restores the editable contact sheet
with all values and the selected file preserved in memory.

The production implementation is an Express route in `server/routes/contact.ts`.
It validates every field again, checks the upload's extension and binary
signature, applies origin and MySQL-backed IP/email limits, writes the
submission and pending notification in one transaction, and only then attempts
the studio email. A failed or timed-out email remains recorded as `failed`; the
durable submission ID is still returned so a lead is not duplicated by a retry.

The Hostinger deployment and live verification steps are in
[`docs/hostinger-contact-backend.md`](./hostinger-contact-backend.md).

## State and privacy

Journey data lives only in the mounted React reducer. It is not written to
cookies, local storage, session storage, analytics, or URLs. Refreshing the page
starts a new request. Browser Back moves between editable steps without losing
values during the current page session.

The reference file is held in memory and uploaded only with the final
submission. It is never uploaded when selected or when moving between steps.

## Accessibility and motion

- Each step is a semantic form or section with a focused heading.
- Validation uses visible review marks and text connected with
  `aria-describedby`.
- Step changes and submission status use live regions.
- Controls remain native and keyboard operable.
- The paper stage exposes `aria-busy` while transformations are locked.
- `prefers-reduced-motion: reduce` replaces the 3D paper choreography with a
  transition shorter than 250 ms.

## Manual integration check

1. Configure the real API endpoint.
2. Submit without optional files, then with each supported file family.
3. Verify server validation and spam controls.
4. Confirm success JSON includes `submissionId` or `id`.
5. Simulate a timeout and a non-2xx response; entered data must remain.
6. Test keyboard-only completion and a reduced-motion browser profile.
7. Check desktop, tablet, and mobile while the shared navigation is open.
