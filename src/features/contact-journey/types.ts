export type ContactStepNumber = 1 | 2 | 3 | 4;

export type ContactAccent = 'yellow' | 'blue' | 'pink' | 'green';

export type ContactTransitionState =
  | 'idle'
  | 'unfolding'
  | 'folding'
  | 'submitting'
  | 'sealing'
  | 'complete'
  | 'error';

export interface ChallengeDetails {
  solutionType: string;
  department: string;
  challengeText: string;
  referenceFile: File | null;
}

export interface ContactDetails {
  name: string;
  email: string;
  phone: string;
  website: string;
  role: string;
}

export type ChallengeField = keyof Omit<ChallengeDetails, 'referenceFile'>;
export type ContactField = keyof ContactDetails;
export type ContactErrorField =
  | ChallengeField
  | ContactField
  | 'referenceFile'
  | 'submission';

export type ContactErrors = Partial<Record<ContactErrorField, string>>;

export interface RoughNoteContactState {
  currentStep: ContactStepNumber;
  transitionState: ContactTransitionState;
  challenge: ChallengeDetails;
  contact: ContactDetails;
  errors: ContactErrors;
  submissionId?: string;
}

export interface ContactStepDefinition {
  id: ContactStepNumber;
  title: string;
  accent: ContactAccent;
}

export interface ContactSubmissionPayload {
  solutionType: string;
  department: string;
  challengeText: string;
  name: string;
  email: string;
  phone: string;
  website: string;
  role: string;
  source: 'rough-note-contact-journey';
}

export interface ContactSubmissionResult {
  submissionId: string;
}
