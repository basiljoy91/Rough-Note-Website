import brandLogo from '../../assets/brand/rough-note-logo.jpg';
import type { NavigationKey } from './navigation.data';
import { NavigationLinks } from './SidebarNavigation';

interface MobileNavigationProps {
  activeItem: NavigationKey;
  ctaLabel?: string;
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export function MobileNavigation({
  activeItem,
  ctaLabel = "Let's Build Something Amazing!",
  open,
  onClose,
  onOpen
}: MobileNavigationProps) {
  return (
    <>
      <button
        type="button"
        className={`menu-toggle${open ? ' active' : ''}`}
        aria-label="Open navigation menu"
        aria-expanded={open}
        onClick={onOpen}
        data-drawing-exclusion
      >
        <span className="menu-lines" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="compact-brand" aria-hidden="true">
          <img src={brandLogo} alt="" />
          <b>ROUGH NOTE</b>
        </span>
        <span className="menu-tab" aria-hidden="true">
          RN
        </span>
      </button>

      <button
        type="button"
        className={`menu-backdrop${open ? ' active' : ''}`}
        aria-label="Close navigation menu"
        onClick={onClose}
        tabIndex={open ? 0 : -1}
      />

      <aside
        className={`mobile-menu${open ? ' active' : ''}`}
        aria-label="Mobile navigation"
        aria-hidden={!open}
      >
        <button
          type="button"
          className="close-menu"
          aria-label="Close navigation menu"
          onClick={onClose}
        >
          ×
        </button>
        <a
          href="/html/index.html?animated=true"
          className="brand"
          aria-label="Rough Note home"
          onClick={onClose}
        >
          <img
            src={brandLogo}
            alt="Rough Note"
            className="logo"
          />
          <span className="brand-name">ROUGH NOTE</span>
          <span className="brand-tagline">IDEAS. SKETCHED. REALIZED.</span>
        </a>
        <NavigationLinks
          activeItem={activeItem}
          mobile
          onNavigate={onClose}
        />
        <a href="/html/contact.html" className="quote-btn" onClick={onClose}>
          {ctaLabel}
        </a>
        <p className="mobile-note">See you inside! ♡</p>
      </aside>
    </>
  );
}
