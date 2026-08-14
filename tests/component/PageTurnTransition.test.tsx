import { act, fireEvent, render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  PAGE_NOTE_ARRIVAL_KEY,
  PAGE_NOTE_SETTLE_DURATION,
  PageTurnTransition
} from '../../src/shared/navigation/PageTurnTransition';

vi.mock('html2canvas', () => ({
  default: vi.fn(async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    return canvas;
  })
}));

describe('PageTurnTransition', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.history.replaceState({}, '', '/html/index.html?animated=true');
    document.head
      .querySelectorAll('[data-rn-prefetch]')
      .forEach((element) => element.remove());
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: vi.fn()
    });
  });

  it('moves to a same-page destination without creating a cross-page stage', () => {
    document.body.innerHTML = `
      <header class="header">
        <a href="/html/index.html?animated=true#div-3">About</a>
        <div class="page-note" data-page-note></div>
      </header>
      <section id="div-3"></section>
      <div class="rn-page-surface"><main>Current paper</main></div>
      <div id="transition-root"></div>
    `;

    render(<PageTurnTransition />, {
      container: document.getElementById('transition-root') as HTMLElement
    });

    const clickCompleted = fireEvent.click(
      document.querySelector('a') as HTMLAnchorElement
    );

    expect(clickCompleted).toBe(false);
    expect(document.querySelector('.rn-page-turn')).not.toBeInTheDocument();
    expect(window.location.hash).toBe('#div-3');
    expect(HTMLElement.prototype.scrollIntoView).toHaveBeenCalledOnce();
    expect(document.documentElement).not.toHaveClass('rn-page-turn-locked');
    expect(document.querySelector('[data-page-note]')).toHaveClass(
      'page-note--arriving'
    );

    act(() => vi.advanceTimersByTime(PAGE_NOTE_SETTLE_DURATION));
    expect(document.querySelector('[data-page-note]')).not.toHaveClass(
      'page-note--arriving'
    );
  });

  it('uses the shared page turn for Home navigation', () => {
    window.history.replaceState({}, '', '/html/services.html');
    document.body.innerHTML = `
      <header class="header">
        <a href="/html/index.html">Home</a>
        <div class="page-note" data-page-note></div>
      </header>
      <div class="rn-page-surface"><main>Our Story</main></div>
      <div id="transition-root"></div>
    `;

    render(<PageTurnTransition />, {
      container: document.getElementById('transition-root') as HTMLElement
    });

    const clickCompleted = fireEvent.click(document.querySelector('a') as HTMLAnchorElement);

    expect(clickCompleted).toBe(false);
    expect(document.querySelector('.rn-page-turn')).toBeInTheDocument();
    expect(document.documentElement).toHaveAttribute('data-page-turn-state', 'turning');
  });

  it('loads the destination beneath a one-direction turning paper', async () => {
    document.body.innerHTML = `
      <header class="header">
        <a href="/html/services.html">Services</a>
        <div class="page-note" data-page-note></div>
      </header>
      <div class="rn-page-surface"><main>Current paper</main></div>
      <section id="div-3"></section>
      <div id="transition-root"></div>
    `;

    render(<PageTurnTransition />, {
      container: document.getElementById('transition-root') as HTMLElement
    });

    const anchor = document.querySelector('a') as HTMLAnchorElement;
    fireEvent.click(anchor);

    const stage = document.querySelector('.rn-page-turn');
    const destination = document.querySelector(
      '.rn-page-turn__destination'
    ) as HTMLIFrameElement;

    expect(stage).toBeInTheDocument();
    expect(stage).toHaveClass('rn-page-turn--ready');
    expect(stage).not.toHaveClass('rn-page-turn--destination-ready');
    expect(destination.src).toContain('/html/services.html');
    expect(document.querySelector('.rn-page-turn__clone')).toHaveTextContent(
      'Current paper'
    );
    expect(document.documentElement).toHaveClass(
      'rn-page-turn-locked',
      'rn-page-turn-active'
    );
    expect(document.documentElement).toHaveAttribute('aria-busy', 'true');

    fireEvent.load(destination);
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
      vi.advanceTimersByTime(450);
      await Promise.resolve();
    });

    expect(stage).toHaveClass('rn-page-turn--ready');
    expect(document.documentElement).toHaveAttribute('data-page-turn-state', 'turning');

    fireEvent.click(anchor);
    fireEvent.click(anchor);
    expect(document.querySelectorAll('.rn-page-turn')).toHaveLength(1);
  });

  it('prefetches destination documents before navigation', () => {
    document.body.innerHTML = `
      <header class="header">
        <a href="/html/services.html">Services</a>
        <a href="/html/process.html">Process</a>
      </header>
      <div class="rn-page-surface"><main>Current paper</main></div>
      <div id="transition-root"></div>
    `;

    render(<PageTurnTransition />, {
      container: document.getElementById('transition-root') as HTMLElement
    });

    expect(document.head.querySelectorAll('link[data-rn-prefetch]')).toHaveLength(2);
    expect(document.querySelector('.rn-page-turn')).not.toBeInTheDocument();
  });

  it('settles the new page note after a cross-page navigation arrives', () => {
    document.body.innerHTML = `
      <header class="header">
        <div class="page-note" data-page-note></div>
      </header>
      <div class="rn-page-surface"><main>Arrived paper</main></div>
      <div id="transition-root"></div>
    `;
    window.sessionStorage.setItem(
      PAGE_NOTE_ARRIVAL_KEY,
      JSON.stringify({ route: '/html/index.html', timestamp: Date.now() })
    );

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
