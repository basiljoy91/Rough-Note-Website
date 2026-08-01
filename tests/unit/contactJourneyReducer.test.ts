import { describe, expect, it } from 'vitest';
import {
  contactJourneyReducer,
  initialContactState
} from '../../src/features/contact-journey/state/contactJourneyReducer';

describe('contactJourneyReducer', () => {
  it('preserves challenge and contact data while changing steps', () => {
    let state = contactJourneyReducer(initialContactState, {
      type: 'SET_CHALLENGE_FIELD',
      field: 'solutionType',
      value: 'Website'
    });
    state = contactJourneyReducer(state, {
      type: 'SET_CONTACT_FIELD',
      field: 'name',
      value: 'Basil'
    });
    state = contactJourneyReducer(state, { type: 'SET_STEP', step: 3 });

    expect(state.currentStep).toBe(3);
    expect(state.challenge.solutionType).toBe('Website');
    expect(state.contact.name).toBe('Basil');
  });

  it('locks transitions independently from data and records confirmation', () => {
    const submitting = contactJourneyReducer(initialContactState, {
      type: 'SET_TRANSITION',
      value: 'submitting'
    });
    const complete = contactJourneyReducer(submitting, {
      type: 'SUBMISSION_SUCCESS',
      submissionId: 'RN-2048'
    });

    expect(submitting.transitionState).toBe('submitting');
    expect(complete).toMatchObject({
      currentStep: 4,
      transitionState: 'complete',
      submissionId: 'RN-2048'
    });
  });

  it('resets to a clean in-memory request', () => {
    const changed = {
      ...initialContactState,
      currentStep: 4 as const,
      submissionId: 'RN-1'
    };
    expect(contactJourneyReducer(changed, { type: 'RESET' })).toEqual(
      initialContactState
    );
  });
});
