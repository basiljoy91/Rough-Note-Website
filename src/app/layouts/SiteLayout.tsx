import { useEffect, useState, type ReactNode } from 'react';
import { MobileNavigation } from '../../shared/navigation/MobileNavigation';
import { SidebarNavigation } from '../../shared/navigation/SidebarNavigation';
import type { NavigationKey } from '../../shared/navigation/navigation.data';
import '../../shared/navigation/navigation.global.css';
import '../../shared/navigation/navigation-responsive.global.css';

interface SiteLayoutProps {
  activeItem: NavigationKey;
  children: ReactNode;
  mobileCtaLabel?: string;
  pageLabel: string;
  pageTitle: string;
}

export function SiteLayout({
  activeItem,
  children,
  mobileCtaLabel,
  pageLabel,
  pageTitle
}: SiteLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    return () => document.body.classList.remove('menu-open');
  }, [menuOpen]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, []);

  return (
    <>
      <SidebarNavigation
        activeItem={activeItem}
        pageLabel={pageLabel}
        pageTitle={pageTitle}
      />
      <MobileNavigation
        activeItem={activeItem}
        open={menuOpen}
        onOpen={() => setMenuOpen(true)}
        onClose={() => setMenuOpen(false)}
        ctaLabel={mobileCtaLabel}
      />
      {children}
    </>
  );
}
