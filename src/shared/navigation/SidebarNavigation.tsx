import brandLogo from '../../assets/brand/rough-note-logo.jpg';
import behanceIcon from '../../assets/icons/behance.svg';
import instagramIcon from '../../assets/icons/instagram.svg';
import linkedinIcon from '../../assets/icons/linkedin.svg';
import {
  navigationItems,
  type NavigationKey
} from './navigation.data';

interface SidebarNavigationProps {
  activeItem: NavigationKey;
  pageLabel: string;
  pageTitle: string;
}

function Brand() {
  return (
    <a
      href="/html/index.html?animated=true"
      className="brand"
      aria-label="Rough Note home"
    >
      <img
        src={brandLogo}
        alt="Rough Note"
        className="logo"
      />
      <span className="brand-name">ROUGH NOTE</span>
      <span className="brand-tagline">IDEAS. SKETCHED. REALIZED.</span>
    </a>
  );
}

export function NavigationLinks({
  activeItem,
  mobile = false,
  onNavigate
}: {
  activeItem: NavigationKey;
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <nav className="nav-links" aria-label={mobile ? 'Mobile pages' : 'Website pages'}>
      {navigationItems.map((item) => {
        if (mobile && item.desktopOnly) return null;
        return (
          <span key={item.key}>
            {item.dividerBefore && (
              <span className="nav-divider" aria-hidden="true" />
            )}
            <a
              href={item.href}
              className={`nav-link${activeItem === item.key ? ' active' : ''}${
                item.key === 'next' ? ' nex-link' : ''
              }`}
              aria-current={activeItem === item.key ? 'page' : undefined}
              onClick={onNavigate}
            >
              <img className="nav-icon" src={item.icon} alt="" />
              {item.label}
              {item.badge && <small className="new-badge">{item.badge}</small>}
            </a>
          </span>
        );
      })}
    </nav>
  );
}

export function SidebarNavigation({
  activeItem,
  pageLabel,
  pageTitle
}: SidebarNavigationProps) {
  const socialIcons = [
    { label: 'LinkedIn', source: linkedinIcon },
    { label: 'Instagram', source: instagramIcon },
    { label: 'Behance', source: behanceIcon }
  ];

  return (
    <header
      className="header"
      aria-label="Main navigation"
      data-rough-anchor="site-navigation"
    >
      <div className="spiral-binding" aria-hidden="true" />
      <div className="notebook-nav">
        <Brand />
        <NavigationLinks activeItem={activeItem} />
        <div className="nav-footer">
          <div className="page-note">
            <span>{pageLabel}</span>
            <strong>{pageTitle}</strong>
          </div>
          <div className="social-links" aria-label="Social channels">
            {socialIcons.map(({ label, source }) => (
              <span key={label} aria-label={label}>
                <img src={source} alt="" />
              </span>
            ))}
          </div>
          <p>
            Let&apos;s build
            <br />
            something amazing!
          </p>
        </div>
      </div>
    </header>
  );
}
