import { act, fireEvent, render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  PAGE_NOTE_ARRIVAL_KEY,
  PAGE_NOTE_SETTLE_DURATION,
  PAGE_TURN_DURATION,
  PageTurnTransition
} from '../../src/shared/navigation/PageTurnTransition';

const capturePage = vi.hoisted(() => vi.fn());

vi.mock('html2canvas', () => ({
  default: capturePage
}));

describe('PageTurnTransition', () => {
  let animationFrames: FrameRequestCallback[];

  beforeEach(() => {
    vi.useFakeTimers();
    animationFrames = [];
    window.history.replaceState({}, '', '/html/index.html?animated=true');
    capturePage.mockReset();
    capturePage.mockImplementation(async () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 800;
      return canvas;
    });
    Object.defineProperty(window, 'requestAnimationFrame', {
      configurable: true,
      value: vi.fn((callback: FrameRequestCallback) => {
        animationFrames.push(callback);
        return animationFrames.length;
      })
    });
    Object.defineProperty(window, 'cancelAnimationFrame', {
      configurable: true,
      value: vi.fn()
    });
    vi.spyOn(performance, 'now').mockReturnValue(0);
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: vi.fn()
    });
  });

  const resolveCapture = async () => {
    await act(async () => {
      vi.runOnlyPendingTimers();
      await Promise.resolve();
      await Promise.resolve();
    });
  };

  const finishTurn = () => {
    act(() => animationFrames.shift()?.(0));
    act(() => animationFrames.shift()?.(PAGE_TURN_DURATION));
  };

  it('turns the visible page before moving to a same-page destination', async () => {
    document.body.innerHTML = `
      <header class="header">
        <a href="/html/index.html?animated=true#div-3">About</a>
        <div class="page-note" data-page-note></div>
      </header>
      <section id="div-3"></section>
      <div id="transition-root"></div>
    `;

    render(<PageTurnTransition />, {
      container: document.getElementById('transition-root') as HTMLElement
    });

    const clickCompleted = fireEvent.click(
      document.querySelector('a') as HTMLAnchorElement
    );

    expect(clickCompleted).toBe(false);
    expect(document.documentElement).toHaveClass('rn-page-turn-capturing');
    expect(document.querySelector('[data-page-note]')).toHaveClass(
      'page-note--departing',
      'page-note--fall-next'
    );
    expect(window.location.hash).toBe('');

    await resolveCapture();

    expect(capturePage).toHaveBeenCalledOnce();
    expect(document.documentElement).toHaveClass('rn-page-turn-active');
    expect(document.querySelector('.rn-page-turn__front')).toBeInTheDocument();
    expect(document.querySelector('.rn-page-turn__curl')).toBeInTheDocument();

    finishTurn();

    expect(window.location.hash).toBe('#div-3');
    expect(HTMLElement.prototype.scrollIntoView).toHaveBeenCalledOnce();
    expect(document.documentElement).not.toHaveClass('rn-page-turn-locked');
    expect(document.documentElement).not.toHaveAttribute('aria-busy');
    expect(document.querySelector('[data-page-note]')).toHaveClass(
      'page-note--arriving'
    );

    act(() => vi.advanceTimersByTime(PAGE_NOTE_SETTLE_DURATION));
    expect(document.querySelector('[data-page-note]')).not.toHaveClass(
      'page-note--arriving'
    );
  });

  it('ignores repeated navigation clicks while the page is turning', async () => {
    document.body.innerHTML = `
      <header class="header">
        <a href="/html/index.html?animated=true#div-3">About</a>
      </header>
      <section id="div-3"></section>
      <div id="transition-root"></div>
    `;

    render(<PageTurnTransition />, {
      container: document.getElementById('transition-root') as HTMLElement
    });

    const anchor = document.querySelector('a') as HTMLAnchorElement;
    fireEvent.click(anchor);
    fireEvent.click(anchor);
    fireEvent.click(anchor);

    await resolveCapture();

    expect(capturePage).toHaveBeenCalledOnce();
  });

  it('renders a smooth paper underlay and spiral binding without tear pieces', () => {
    const { container } = render(<PageTurnTransition />);

    expect(container.querySelector('.rn-page-turn__underlay')).toBeInTheDocument();
    expect(container.querySelectorAll('.rn-page-turn__binding i')).toHaveLength(12);
    expect(container.querySelector('[class*="page-tear"]')).not.toBeInTheDocument();
  });

  it('settles the new page note after a cross-page navigation arrives', () => {
    document.body.innerHTML = `
      <header class="header">
        <div class="page-note" data-page-note></div>
      </header>
      <div id="transition-root"></div>
    `;
    window.sessionStorage.setItem(PAGE_NOTE_ARRIVAL_KEY, 'enter');

    render(<PageTurnTransition />, {
      container: document.getElementById('transition-root') as HTMLElement
    });

    const pageNote = document.querySelector('[data-page-note]');
    expect(window.sessionStorage.getItem(PAGE_NOTE_ARRIVAL_KEY)).toBeNull();
    expect(pageNote).toHaveClass('page-note--arriving');

    act(() => vi.advanceTimersByTime(PAGE_NOTE_SETTLE_DURATION));
    expect(pageNote).not.toHaveClass('page-note--arriving');
  });
});
