import type {
  ChallengeField,
  ContactDetails,
  ContactErrors,
  ContactField,
  ContactStepNumber,
  ContactTransitionState,
  RoughNoteContactState
} from '../types';

export const initialContactState: RoughNoteContactState = {
  currentStep: 1,
  transitionState: 'idle',
  challenge: {
    solutionType: '',
    department: '',
    challengeText: '',
    referenceFile: null
  },
  contact: {
    name: '',
    email: '',
    phone: '',
    website: '',
    role: ''
  },
  errors: {}
};

export type ContactJourneyAction =
  | {
      type: 'SET_CHALLENGE_FIELD';
      field: ChallengeField;
      value: string;
    }
  | {
      type: 'SET_CONTACT_FIELD';
      field: ContactField;
      value: string;
    }
  | { type: 'SET_REFERENCE_FILE'; file: File | null }
  | { type: 'SET_ERRORS'; errors: ContactErrors }
  | { type: 'CLEAR_ERROR'; field: keyof ContactErrors }
  | { type: 'SET_TRANSITION'; value: ContactTransitionState }
  | { type: 'SET_STEP'; step: ContactStepNumber }
  | { type: 'SUBMISSION_SUCCESS'; submissionId: string }
  | { type: 'RESET' };

export function contactJourneyReducer(
  state: RoughNoteContactState,
  action: ContactJourneyAction
): RoughNoteContactState {
  switch (action.type) {
    case 'SET_CHALLENGE_FIELD':
      return {
        ...state,
        challenge: { ...state.challenge, [action.field]: action.value },
        errors: { ...state.errors, [action.field]: undefined }
      };
    case 'SET_CONTACT_FIELD':
      return {
        ...state,
        contact: { ...state.contact, [action.field]: action.value },
        errors: { ...state.errors, [action.field]: undefined }
      };
    case 'SET_REFERENCE_FILE':
      return {
        ...state,
        challenge: { ...state.challenge, referenceFile: action.file },
        errors: { ...state.errors, referenceFile: undefined }
      };
    case 'SET_ERRORS':
      return { ...state, errors: action.errors };
    case 'CLEAR_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.field]: undefined }
      };
    case 'SET_TRANSITION':
      return { ...state, transitionState: action.value };
    case 'SET_STEP':
      return {
        ...state,
        currentStep: action.step,
        transitionState: 'idle',
        errors: {}
      };
    case 'SUBMISSION_SUCCESS':
      return {
        ...state,
        currentStep: 4,
        transitionState: 'complete',
        submissionId: action.submissionId,
        errors: {}
      };
    case 'RESET':
      return initialContactState;
    default:
      return state;
  }
}

export function withContactValues(
  state: RoughNoteContactState,
  values: Partial<ContactDetails>
): RoughNoteContactState {
  return { ...state, contact: { ...state.contact, ...values } };
}
