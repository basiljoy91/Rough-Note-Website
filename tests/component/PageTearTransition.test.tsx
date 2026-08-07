import { act, fireEvent, render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  PAGE_TEAR_ENTER_DURATION,
  PAGE_TEAR_EXIT_DURATION,
  PAGE_TEAR_STORAGE_KEY,
  PageTearTransition
} from '../../src/shared/navigation/PageTearTransition';

describe('PageTearTransition', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.history.replaceState({}, '', '/html/index.html?animated=true');
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: vi.fn()
    });
  });

  it('covers and reveals a same-page navbar destination without reloading', () => {
    document.body.innerHTML = `
      <header class="header">
        <a href="/html/index.html?animated=true#div-3">About</a>
      </header>
      <section id="div-3"></section>
      <div id="transition-root"></div>
    `;

    render(<PageTearTransition />, {
      container: document.getElementById('transition-root') as HTMLElement
    });

    const clickCompleted = fireEvent.click(document.querySelector('a') as HTMLAnchorElement);

    expect(clickCompleted).toBe(false);
    expect(document.documentElement).toHaveClass('rn-page-tear-fallback-exit');
    expect(window.location.hash).toBe('');

    act(() => vi.advanceTimersByTime(PAGE_TEAR_EXIT_DURATION));

    expect(window.location.hash).toBe('#div-3');
    expect(document.documentElement).toHaveClass('rn-page-tear-fallback-enter');
    expect(HTMLElement.prototype.scrollIntoView).toHaveBeenCalledOnce();

    act(() => vi.advanceTimersByTime(PAGE_TEAR_ENTER_DURATION));

    expect(document.documentElement).not.toHaveClass('rn-page-tear-locked');
    expect(document.documentElement).not.toHaveAttribute('aria-busy');
  });

  it('ignores repeated navbar clicks while the paper transition is running', () => {
    document.body.innerHTML = `
      <header class="header">
        <a href="/html/index.html?animated=true#div-3">About</a>
      </header>
      <section id="div-3"></section>
      <div id="transition-root"></div>
    `;
    const pushState = vi.spyOn(window.history, 'pushState');

    render(<PageTearTransition />, {
      container: document.getElementById('transition-root') as HTMLElement
    });

    const anchor = document.querySelector('a') as HTMLAnchorElement;
    fireEvent.click(anchor);
    fireEvent.click(anchor);
    fireEvent.click(anchor);

    act(() => vi.advanceTimersByTime(PAGE_TEAR_EXIT_DURATION));

    expect(pushState).toHaveBeenCalledOnce();
  });

  it('tears open after arriving from another document', () => {
    window.sessionStorage.setItem(PAGE_TEAR_STORAGE_KEY, 'enter');

    render(<PageTearTransition />);

    expect(window.sessionStorage.getItem(PAGE_TEAR_STORAGE_KEY)).toBeNull();
    expect(document.documentElement).toHaveClass('rn-page-tear-fallback-enter');

    act(() => vi.advanceTimersByTime(PAGE_TEAR_ENTER_DURATION));

    expect(document.documentElement).not.toHaveClass('rn-page-tear-fallback-enter');
  });
});
