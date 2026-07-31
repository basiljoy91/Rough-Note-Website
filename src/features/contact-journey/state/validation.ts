import {
  ACCEPTED_FILE_EXTENSIONS,
  ACCEPTED_FILE_TYPES,
  MAX_REFERENCE_FILE_SIZE
} from '../constants';
import type {
  ChallengeDetails,
  ContactDetails,
  ContactErrors
} from '../types';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WEBSITE_PATTERN = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/i;

export function validateChallenge(
  challenge: ChallengeDetails
): ContactErrors {
  const errors: ContactErrors = {};
  if (!challenge.solutionType) {
    errors.solutionType = 'Choose the type of solution you need.';
  }
  if (!challenge.department) {
    errors.department = 'Choose the department this is for.';
  }
  if (challenge.challengeText.trim().length < 15) {
    errors.challengeText =
      'Tell us a little more about the challenge (at least 15 characters).';
  }
  return errors;
}

export function validateContact(contact: ContactDetails): ContactErrors {
  const errors: ContactErrors = {};
  if (!contact.name.trim()) {
    errors.name = 'Please tell us your name.';
  }
  if (!EMAIL_PATTERN.test(contact.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }
  if (contact.website.trim() && !WEBSITE_PATTERN.test(contact.website.trim())) {
    errors.website = 'Enter a valid website address.';
  }
  if (!contact.role) {
    errors.role = 'Choose your role.';
  }
  return errors;
}

export function validateReferenceFile(file: File): string | undefined {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (
    !ACCEPTED_FILE_EXTENSIONS.includes(
      extension as (typeof ACCEPTED_FILE_EXTENSIONS)[number]
    ) ||
    !ACCEPTED_FILE_TYPES.includes(
      file.type as (typeof ACCEPTED_FILE_TYPES)[number]
    )
  ) {
    return 'Use a JPG, JPEG, PNG, WEBP, PDF, DOC, or DOCX file.';
  }
  if (file.size > MAX_REFERENCE_FILE_SIZE) {
    return 'The reference file must be 5 MB or smaller.';
  }
  return undefined;
}

export function firstErrorField(errors: ContactErrors): string | undefined {
  return Object.keys(errors)[0];
}

export function hasErrors(errors: ContactErrors): boolean {
  return Object.values(errors).some(Boolean);
}
