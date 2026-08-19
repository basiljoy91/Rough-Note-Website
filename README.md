# Rough Note website

Rough Note is a Vite-powered, React 19 multi-page website. HTML documents are
thin mounts; page composition, shared layout, interactions and styling live in
typed modules under `src/`.

## Architecture

```text
index.html                         intro mount
html/                              homepage and content-page mounts
src/
  app/
    entrypoints/                   one entry module per page type
    layouts/                       shared site shells
    styles/                        reset, tokens and global rules
  shared/
    navigation/                    desktop/mobile notebook navigation
    footer/                        shared footer export
    hooks/                         reusable page behavior
    icons/ and ui/                 shared visual primitives
  pages/
    intro/                         cinematic intro
    home/                          homepage and isolated section modules
    contact/                       contact-page composition
  features/
    contact-journey/               multi-step contact experience
    notebook-footer/               notebook paper footer
    rough-note-drawing/            page annotation layer
    workbook-carousel/             services workbook behavior
  assets/                          imported brand, icon and texture assets
public/
  assets/                          content media used by raw section markup
  media/videos/                    large video files
tests/
  unit/ component/ integration/ visual/ e2e/
```

Homepage sections keep their own markup, stylesheet and behavior next to each
other. `HomePage.tsx` composes those sections; it does not contain their full
implementation. `SiteLayout.tsx` is the single owner of the desktop sidebar and
mobile navigation, so pages do not duplicate menu code.

Vite imports files in `src/assets` and fingerprints them for production.
Content images referenced by extracted HTML fragments remain in
`public/assets`; Vite copies them without changing their stable URLs.

## Development

```sh
npm install
npm run dev
```

The Vite development server runs at `http://localhost:8000`. It exposes the
intro at `/`, the homepage at `/html/index.html`, and the contact journey at
`/html/contact.html`. A plain static server cannot run the source TSX
entrypoints.

## Canonical content routes

- `/html/about.html` mounts the complete Our Story experience.
- `/html/work.html` mounts the complete Our Work experience.
- `/html/projects.html` is reserved for the separate Next Software preview.
- `/html/careers.html`, `/html/privacy.html`, and `/html/terms.html` are the
  canonical footer information pages.

## Deployment targets

The default production build is intentionally Hostinger-safe:

```sh
npm run build
# equivalent to npm run build:hostinger
```

It emits the Vite site into `dist/` and the Express/MySQL server into
`dist-server/`; the OpenAI Sites worker and metadata are excluded. For an
OpenAI Sites deployment, use the explicit static target:

```sh
npm run build:sites
```

Both commands verify that the target-specific output contains exactly the
expected hosting files.

## Verification

```sh
npm run validate
npm run test:e2e
```

`npm run validate` runs ESLint, strict TypeScript, the single multi-page
production build, unit/component tests and the static architecture check.

## Hostinger APIs

The contact page reads its endpoint from:

```html
<meta name="rough-note-contact-endpoint" content="/api/contact" />
```

The expected request/response contract is documented in
`docs/rough-note-contact.md`.

The Hostinger MySQL, SMTP, environment and live acceptance steps are documented
in `docs/hostinger-contact-backend.md`.

The same Express process also provides:

- `POST /api/newsletter/subscribe`, plus opaque verification and unsubscribe
  links for double opt-in.
- `GET /api/availability?date=YYYY-MM-DD` for live MySQL and Google Calendar
  availability.
- `POST /api/bookings` with an `Idempotency-Key` header for transactional slot
  locking, Google Calendar/Meet creation and confirmation email.
- Opaque `/api/bookings/manage`, `/cancel` and `/reschedule` journeys that do
  not require a visitor account.

Generate the one-time Google refresh token locally with:

```sh
npm run calendar:authorize
```

The exact OAuth and Hostinger secret steps are in the deployment checklist.

## Drawing privacy

Before consent, drawing strokes stay in memory. After the visitor chooses
“Remember my art!”, route-specific vector drawings are stored in IndexedDB.
The feature performs no drawing upload, analytics call or cookie write.

Set this value before a page entrypoint executes to disable the drawing layer:

```html
<script>
  window.ROUGH_NOTE_FEATURE_FLAGS = { roughPencil: false };
</script>
```
