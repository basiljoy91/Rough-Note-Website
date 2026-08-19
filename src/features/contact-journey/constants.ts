import type { ContactStepDefinition } from './types';
export {
  ACCEPTED_FILE_EXTENSIONS,
  ACCEPTED_FILE_TYPES,
  CONTACT_ROLES,
  DEPARTMENTS,
  MAX_REFERENCE_FILE_SIZE,
  SOLUTION_TYPES
} from '../../shared/contact-contract';

export const CONTACT_STEPS: ContactStepDefinition[] = [
  { id: 1, title: 'Start Your\nRough Note', accent: 'yellow' },
  { id: 2, title: 'Tell Us About\nYour Challenge', accent: 'blue' },
  { id: 3, title: 'Almost There!', accent: 'pink' },
  { id: 4, title: 'Thank You!', accent: 'green' }
];
