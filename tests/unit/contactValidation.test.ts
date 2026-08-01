import { describe, expect, it } from 'vitest';
import {
  MAX_REFERENCE_FILE_SIZE
} from '../../src/features/contact-journey/constants';
import {
  validateChallenge,
  validateContact,
  validateReferenceFile
} from '../../src/features/contact-journey/state/validation';

describe('Rough Note contact validation', () => {
  it('requires the three challenge fields', () => {
    expect(
      validateChallenge({
        solutionType: '',
        department: '',
        challengeText: '',
        referenceFile: null
      })
    ).toEqual({
      solutionType: 'Choose the type of solution you need.',
      department: 'Choose the department this is for.',
      challengeText:
        'Tell us a little more about the challenge (at least 15 characters).'
    });
  });

  it('validates contact identity without requiring optional fields', () => {
    expect(
      validateContact({
        name: '',
        email: 'wrong',
        phone: '',
        website: 'not a website',
        role: ''
      })
    ).toEqual({
      name: 'Please tell us your name.',
      email: 'Enter a valid email address.',
      website: 'Enter a valid website address.',
      role: 'Choose your role.'
    });
  });

  it('accepts supported files and rejects type or size violations', () => {
    expect(
      validateReferenceFile(
        new File(['image'], 'idea.png', { type: 'image/png' })
      )
    ).toBeUndefined();
    expect(
      validateReferenceFile(
        new File(['script'], 'idea.exe', {
          type: 'application/octet-stream'
        })
      )
    ).toMatch(/JPG/);
    expect(
      validateReferenceFile(
        new File([new Uint8Array(MAX_REFERENCE_FILE_SIZE + 1)], 'large.pdf', {
          type: 'application/pdf'
        })
      )
    ).toMatch(/5 MB/);
  });
});
