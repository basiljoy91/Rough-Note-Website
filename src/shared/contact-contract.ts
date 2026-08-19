export const CONTACT_SOURCE = 'rough-note-contact-journey' as const;

export const SOLUTION_TYPES = [
  'Website',
  'ERP / Business Software',
  'AI Automation',
  'Mobile Application',
  'Branding',
  'Motion Graphics',
  'Video Production',
  'Other'
] as const;

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
] as const;

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
] as const;

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

