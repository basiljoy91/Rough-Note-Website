import { act, fireEvent, render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  PAGE_NOTE_ARRIVAL_KEY,
  PAGE_NOTE_SETTLE_DURATION,
  PageTurnTransition
} from '../../src/shared/navigation/PageTurnTransition';

describe('PageTurnTransition', () => {
  let finishTransition: () => void;
  let transitionFinished: Promise<void>;

  beforeEach(() => {
    vi.useFakeTimers();
    window.history.replaceState({}, '', '/html/index.html?animated=true');
    document.head
      .querySelectorAll('[data-rn-prefetch]')
      .forEach((element) => element.remove());

    transitionFinished = new Promise<void>((resolve) => {
      finishTransition = resolve;
    });

    Object.defineProperty(document, 'startViewTransition', {
      configurable: true,
      value: vi.fn((update: () => void) => {
        update();
        return { finished: transitionFinished };
      })
    });
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: vi.fn()
    });
  });

  const finishPageTurn = async () => {
    await act(async () => {
      finishTransition();
      await transitionFinished;
      await Promise.resolve();
    });
  };

  it('turns one direction before moving to a same-page destination', async () => {
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
    expect(document.startViewTransition).toHaveBeenCalledOnce();
    expect(document.documentElement).toHaveClass(
      'rn-page-turn-locked',
      'rn-page-turn-active'
    );
    expect(document.documentElement).toHaveAttribute('aria-busy', 'true');
    expect(document.querySelector('[data-page-note]')).toHaveClass(
      'page-note--departing',
      'page-note--fall-next'
    );
    expect(document.querySelector('[data-page-note]')).not.toHaveClass(
      'page-note--fall-previous'
    );
    expect(window.location.hash).toBe('#div-3');
    expect(HTMLElement.prototype.scrollIntoView).toHaveBeenCalledOnce();

    await finishPageTurn();

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

  it('ignores repeated navigation clicks while the page is turning', () => {
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

    expect(document.startViewTransition).toHaveBeenCalledOnce();
  });

  it('prefetches the destination documents without rendering an overlay layer', () => {
    document.body.innerHTML = `
      <header class="header">
        <a href="/html/services.html">Services</a>
        <a href="/html/process.html">Process</a>
      </header>
      <div id="transition-root"></div>
    `;

    const { container } = render(<PageTurnTransition />, {
      container: document.getElementById('transition-root') as HTMLElement
    });

    expect(container).toBeEmptyDOMElement();
    expect(document.querySelector('.rn-page-turn__underlay')).not.toBeInTheDocument();
    expect(document.querySelector('.rn-page-turn__binding')).not.toBeInTheDocument();
    expect(document.head.querySelectorAll('link[data-rn-prefetch]')).toHaveLength(2);
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
