import type { ContactStepDefinition } from './types';

export const CONTACT_STEPS: ContactStepDefinition[] = [
  { id: 1, title: 'Start Your\nRough Note', accent: 'yellow' },
  { id: 2, title: 'Tell Us About\nYour Challenge', accent: 'blue' },
  { id: 3, title: 'Almost There!', accent: 'pink' },
  { id: 4, title: 'Thank You!', accent: 'green' }
];

export const SOLUTION_TYPES = [
  'Website',
  'ERP / Business Software',
  'AI Automation',
  'Mobile Application',
  'Branding',
  'Motion Graphics',
  'Video Production',
  'Other'
];

export const DEPARTMENTS = [
  'Founder / Management',
  'Sales',
  'Marketing',
  'Operations',
  'Finance',
  'Human Resources',
  'Customer Support',
  'IT / Technology',
  'Other'
];

export const CONTACT_ROLES = [
  'Founder / Owner',
  'Director',
  'Manager',
  'Marketing',
  'Operations',
  'Product',
  'Technology',
  'Consultant',
  'Other'
];

export const ACCEPTED_FILE_EXTENSIONS = [
  'jpg',
  'jpeg',
  'png',
  'webp',
  'pdf',
  'doc',
  'docx'
] as const;

export const ACCEPTED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
] as const;

export const MAX_REFERENCE_FILE_SIZE = 5 * 1024 * 1024;
