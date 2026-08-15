import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  ContactJourney,
  type ContactJourneyTransitions
} from '../../src/features/contact-journey/ContactJourney';

const submissionMock = vi.fn();
const unfoldMock = vi.fn().mockResolvedValue(undefined);
const handoffMock = vi.fn().mockResolvedValue(undefined);
const foldToContactMock = vi.fn().mockResolvedValue(undefined);
const sealEnvelopeMock = vi.fn().mockResolvedValue(undefined);
const reverseMock = vi.fn().mockResolvedValue(undefined);
const transitions: ContactJourneyTransitions = {
  unfold: unfoldMock,
  handoff: handoffMock,
  foldToContact: foldToContactMock,
  sealEnvelope: sealEnvelopeMock,
  reverse: reverseMock
};

function renderJourney() {
  return render(
    <ContactJourney transitions={transitions} submitRequest={submissionMock} />
  );
}

async function reachContactStep(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: 'Start My Rough Note' }));
  await screen.findByRole('heading', {
    name: /Tell Us About\s+Your Challenge/
  });
  await user.selectOptions(
    screen.getByLabelText(/What type of solution do you need/),
    'Website'
  );
  await user.selectOptions(
    screen.getByLabelText(/Which department is this for/),
    'Marketing'
  );
  await user.type(
    screen.getByLabelText(/What’s the challenge you’re facing/),
    'We need a clearer digital sales journey.'
  );
  await user.click(screen.getByRole('button', { name: /Continue/ }));
  await screen.findByRole('heading', { name: 'Almost There!' });
}

describe('ContactJourney', () => {
  beforeEach(() => {
    submissionMock.mockReset();
    unfoldMock.mockReset().mockResolvedValue(undefined);
    handoffMock.mockReset().mockResolvedValue(undefined);
    foldToContactMock.mockReset().mockResolvedValue(undefined);
    sealEnvelopeMock.mockReset().mockResolvedValue(undefined);
    reverseMock.mockReset().mockResolvedValue(undefined);
    Object.defineProperty(window, 'scrollTo', {
      configurable: true,
      value: vi.fn()
    });
  });

  it('blocks Step 2 and focuses the first required field', async () => {
    const user = userEvent.setup();
    renderJourney();
    await user.click(screen.getByRole('button', { name: 'Start My Rough Note' }));
    await waitFor(() => expect(unfoldMock).toHaveBeenCalledTimes(1));
    await screen.findByRole('heading', {
      name: /Tell Us About\s+Your Challenge/
    });
    await user.click(screen.getByRole('button', { name: /Continue/ }));

    expect(
      screen.getByText('Choose the type of solution you need.')
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(
        screen.getByLabelText(/What type of solution do you need/)
      ).toHaveFocus()
    );
  });

  it('prepares the next paper before completing the opening handoff', async () => {
    handoffMock.mockImplementationOnce(async (root: HTMLElement) => {
      expect(root.style.opacity).toBe('');
      expect(
        root.querySelector('[data-contact-incoming-page]')
      ).toBeInTheDocument();
      expect(
        root.querySelector('[data-contact-page-handoff]')
      ).toBeInTheDocument();
    });
    const user = userEvent.setup();
    renderJourney();

    await user.click(screen.getByRole('button', { name: 'Start My Rough Note' }));

    await waitFor(() => expect(handoffMock).toHaveBeenCalledTimes(1));
    await screen.findByRole('heading', {
      name: /Tell Us About\s+Your Challenge/
    });
  });

  it('preserves values when moving forward and back', async () => {
    const user = userEvent.setup();
    renderJourney();
    await reachContactStep(user);
    await user.type(screen.getByLabelText(/Your Name/), 'Ada');
    await user.click(screen.getByRole('button', { name: '← Back' }));

    await screen.findByRole('heading', {
      name: /Tell Us About\s+Your Challenge/
    });
    expect(
      screen.getByLabelText(/What type of solution do you need/)
    ).toHaveValue('Website');
  });

  it('validates contact details and renders success only after API confirmation', async () => {
    submissionMock.mockResolvedValue({ submissionId: 'RN-2026-42' });
    const user = userEvent.setup();
    renderJourney();
    await reachContactStep(user);

    await user.click(screen.getByRole('button', { name: 'Send My Rough Note' }));
    expect(screen.getByText('Please tell us your name.')).toBeInTheDocument();

    await user.type(screen.getByLabelText(/Your Name/), 'Ada Lovelace');
    await user.type(screen.getByLabelText(/Email Address/), 'ada@example.com');
    await user.selectOptions(screen.getByLabelText(/Your Role/), 'Founder / Owner');
    await user.click(screen.getByRole('button', { name: 'Send My Rough Note' }));

    await screen.findByRole('heading', { name: 'Thank You!' });
    expect(screen.getByText(/RN-2026-42/)).toBeInTheDocument();
    expect(submissionMock).toHaveBeenCalledTimes(1);
  });

  it('retains entered values and offers retry after an API failure', async () => {
    submissionMock.mockRejectedValue(new Error('Please try again shortly.'));
    const user = userEvent.setup();
    renderJourney();
    await reachContactStep(user);
    await user.type(screen.getByLabelText(/Your Name/), 'Ada Lovelace');
    await user.type(screen.getByLabelText(/Email Address/), 'ada@example.com');
    await user.selectOptions(screen.getByLabelText(/Your Role/), 'Founder / Owner');
    await user.click(screen.getByRole('button', { name: 'Send My Rough Note' }));

    expect(await screen.findByText('Please try again shortly.')).toBeInTheDocument();
    expect(screen.getByLabelText(/Your Name/)).toHaveValue('Ada Lovelace');
    expect(screen.getByLabelText(/Email Address/)).toHaveValue('ada@example.com');
  });

  it('rejects an unsupported attachment', async () => {
    const user = userEvent.setup({ applyAccept: false });
    renderJourney();
    await user.click(screen.getByRole('button', { name: 'Start My Rough Note' }));
    await screen.findByRole('heading', {
      name: /Tell Us About\s+Your Challenge/
    });
    await user.upload(
      screen.getByLabelText('Upload reference file'),
      new File(['bad'], 'malware.exe', { type: 'application/octet-stream' })
    );
    expect(screen.getByText(/Use a JPG/)).toBeInTheDocument();
  });
});
