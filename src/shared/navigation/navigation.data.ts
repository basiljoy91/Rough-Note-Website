import aboutIcon from '../../assets/icons/about.svg';
import contactIcon from '../../assets/icons/contact.svg';
import homeIcon from '../../assets/icons/house.svg';
import nextSoftwareIcon from '../../assets/icons/nex-software.svg';
import processIcon from '../../assets/icons/our-plans.svg';
import quoteIcon from '../../assets/icons/quote.svg';
import servicesIcon from '../../assets/icons/service.svg';

export type NavigationKey =
  | 'home'
  | 'services'
  | 'about'
  | 'process'
  | 'contact'
  | 'quote'
  | 'next';

export interface NavigationItem {
  key: NavigationKey;
  label: string;
  href: string;
  icon: string;
  desktopOnly?: boolean;
  dividerBefore?: boolean;
  badge?: string;
}

export const navigationItems: NavigationItem[] = [
  {
    key: 'home',
    label: 'Home',
    href: '/html/index.html?animated=true',
    icon: homeIcon
  },
  {
    key: 'services',
    label: 'Our Services',
    href: '/html/services.html',
    icon: servicesIcon
  },
  {
    key: 'about',
    label: 'About',
    href: '/html/index.html?animated=true#div-3',
    icon: aboutIcon,
    dividerBefore: true
  },
  {
    key: 'process',
    label: 'Our Plans',
    href: '/html/process.html',
    icon: processIcon
  },
  {
    key: 'contact',
    label: 'Contact',
    href: '/html/connect.html',
    icon: contactIcon
  },
  {
    key: 'quote',
    label: 'Request for Quotation',
    href: '/html/contact.html',
    icon: quoteIcon,
    desktopOnly: true
  },
  {
    key: 'next',
    label: 'Next Software',
    href: '/html/projects.html',
    icon: nextSoftwareIcon,
    badge: 'NEW'
  }
];
