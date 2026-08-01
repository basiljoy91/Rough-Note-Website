const CONTACT_ROOT_ID = 'rough-note-contact-root';
const CONTACT_BUNDLE_VERSION = '2026.07.29.6';

async function loadContactJourney() {
  const host = document.getElementById(CONTACT_ROOT_ID);
  if (!host || host.dataset.contactMounted === 'true') return;
  host.dataset.contactMounted = 'true';

  const stylesheetUrl = new URL(
    './rough-note-contact-dist/rough-note-contact.css',
    import.meta.url
  );
  stylesheetUrl.searchParams.set('v', CONTACT_BUNDLE_VERSION);
  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = stylesheetUrl.href;
  stylesheet.dataset.roughNoteContactStyles = '';
  document.head.append(stylesheet);

  const moduleUrl = new URL(
    './rough-note-contact-dist/rough-note-contact.js',
    import.meta.url
  );
  moduleUrl.searchParams.set('v', CONTACT_BUNDLE_VERSION);
  const module = await import(/* @vite-ignore */ moduleUrl.href);
  module.mountRoughNoteContact();
}

export function bootstrapRoughNoteContact() {
  void loadContactJourney().catch((error) => {
    const host = document.getElementById(CONTACT_ROOT_ID);
    if (host) {
      delete host.dataset.contactMounted;
      host.innerHTML =
        '<p class="contact-load-error">The contact notebook could not be opened. Please refresh and try again.</p>';
    }
    console.error('The Rough Note contact journey could not be loaded.', error);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrapRoughNoteContact, {
    once: true
  });
} else {
  bootstrapRoughNoteContact();
}
