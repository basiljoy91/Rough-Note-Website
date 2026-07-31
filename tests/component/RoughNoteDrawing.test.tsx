import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { RoughNoteDrawing } from '../../src/features/rough-note-drawing/components/RoughNoteDrawing/RoughNoteDrawing';
import { loadDrawing } from '../../src/features/rough-note-drawing/utils/drawingStorage';

describe('RoughNoteDrawing integration', () => {
  it('applies an immediate tool-matched custom cursor state', async () => {
    const user = userEvent.setup();
    render(<RoughNoteDrawing />);
    await waitFor(() =>
      expect(document.documentElement.dataset.roughNoteTool).toBe('pencil')
    );
    await user.click(screen.getByRole('button', { name: 'Use pen' }));
    await waitFor(() =>
      expect(document.documentElement.dataset.roughNoteTool).toBe('pen')
    );
  });

  it('temporarily restores normal interaction while Space is held', async () => {
    render(<RoughNoteDrawing />);
    fireEvent.keyDown(window, { code: 'Space', key: ' ' });
    await waitFor(() =>
      expect(document.documentElement.dataset.roughNoteInteraction).toBe(
        'browse'
      )
    );
    fireEvent.keyUp(window, { code: 'Space', key: ' ' });
    await waitFor(() =>
      expect(document.documentElement.dataset.roughNoteInteraction).toBe('draw')
    );
  });

  it('creates a vector stroke from Pointer Events and enables undo', () => {
    const surface = document.createElement('div');
    surface.dataset.testid = 'drawing-surface';
    document.body.append(surface);
    render(<RoughNoteDrawing />);
    const undo = screen.getByRole('button', { name: 'Undo' });
    expect(undo).toBeDisabled();

    fireEvent.pointerDown(surface, {
      pointerId: 1,
      pointerType: 'mouse',
      button: 0,
      clientX: 50,
      clientY: 60,
      pressure: 0.5
    });
    fireEvent.pointerMove(surface, {
      pointerId: 1,
      pointerType: 'mouse',
      clientX: 100,
      clientY: 110,
      pressure: 0.7
    });
    fireEvent.pointerUp(surface, {
      pointerId: 1,
      pointerType: 'mouse',
      clientX: 100,
      clientY: 110
    });

    expect(undo).toBeEnabled();
  });

  it('does not start a stroke on links, forms, buttons or exclusions', () => {
    const protectedButton = document.createElement('button');
    protectedButton.textContent = 'Protected action';
    document.body.append(protectedButton);
    render(<RoughNoteDrawing />);

    fireEvent.pointerDown(protectedButton, {
      pointerId: 2,
      pointerType: 'mouse',
      button: 0,
      clientX: 20,
      clientY: 20
    });
    fireEvent.pointerMove(protectedButton, {
      pointerId: 2,
      pointerType: 'mouse',
      clientX: 80,
      clientY: 80
    });
    fireEvent.pointerUp(protectedButton, {
      pointerId: 2,
      pointerType: 'mouse'
    });

    expect(screen.getByRole('button', { name: 'Undo' })).toBeDisabled();
  });

  it('safely finishes a gesture interrupted by pointer cancellation', () => {
    const surface = document.createElement('div');
    document.body.append(surface);
    render(<RoughNoteDrawing />);
    fireEvent.pointerDown(surface, {
      pointerId: 3,
      pointerType: 'pen',
      button: 0,
      clientX: 40,
      clientY: 40
    });
    fireEvent.pointerMove(surface, {
      pointerId: 3,
      pointerType: 'pen',
      clientX: 90,
      clientY: 90
    });
    fireEvent.pointerCancel(surface, {
      pointerId: 3,
      pointerType: 'pen'
    });
    expect(screen.getByRole('button', { name: 'Undo' })).toBeEnabled();
  });

  it('keeps independent in-memory drawing documents across SPA routes', async () => {
    const user = userEvent.setup();
    const surface = document.createElement('div');
    document.body.append(surface);
    render(<RoughNoteDrawing />);
    await user.click(screen.getByRole('button', { name: 'No, thanks' }));
    fireEvent.pointerDown(surface, {
      pointerId: 9,
      pointerType: 'mouse',
      button: 0,
      clientX: 25,
      clientY: 25
    });
    fireEvent.pointerMove(surface, {
      pointerId: 9,
      pointerType: 'mouse',
      clientX: 75,
      clientY: 75
    });
    fireEvent.pointerUp(surface, {
      pointerId: 9,
      pointerType: 'mouse'
    });
    expect(document.querySelector('[data-rough-note-root]')).toHaveAttribute(
      'data-stroke-count',
      '1'
    );

    window.history.pushState({}, '', '/contact');
    await waitFor(() =>
      expect(document.querySelector('[data-rough-note-root]')).toHaveAttribute(
        'data-stroke-count',
        '0'
      )
    );
    window.history.pushState({}, '', '/');
    await waitFor(() =>
      expect(document.querySelector('[data-rough-note-root]')).toHaveAttribute(
        'data-stroke-count',
        '1'
      )
    );
  });

  it('keeps declined drawings memory-only for the tab session', async () => {
    const user = userEvent.setup();
    render(<RoughNoteDrawing />);
    await user.click(screen.getByRole('button', { name: 'No, thanks' }));
    expect(
      screen.queryByText('Rough Note Memory:')
    ).not.toBeInTheDocument();
    expect(window.localStorage.length).toBe(0);
    expect(
      window.sessionStorage.getItem(
        'rough-note:drawing-consent-declined:v1'
      )
    ).toBe('declined');
  });

  it('records accepted browser-storage consent with the privacy copy', async () => {
    const user = userEvent.setup();
    render(<RoughNoteDrawing />);
    expect(
      screen.getByText(/Nothing is uploaded to our server/i)
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Remember my art!' }));
    expect(window.localStorage.getItem('rough-note:drawing-consent:v1')).toBe(
      'accepted'
    );
    await waitFor(() =>
      expect(screen.queryByText('Rough Note Memory:')).not.toBeInTheDocument()
    );
  });

  it('clears the saved drawing immediately so a reload cannot restore it', async () => {
    const user = userEvent.setup();
    const surface = document.createElement('div');
    document.body.append(surface);
    render(<RoughNoteDrawing />);
    await user.click(screen.getByRole('button', { name: 'Remember my art!' }));

    fireEvent.pointerDown(surface, {
      pointerId: 12,
      pointerType: 'mouse',
      button: 0,
      clientX: 30,
      clientY: 30
    });
    fireEvent.pointerMove(surface, {
      pointerId: 12,
      pointerType: 'mouse',
      clientX: 90,
      clientY: 90
    });
    fireEvent.pointerUp(surface, {
      pointerId: 12,
      pointerType: 'mouse'
    });
    expect(document.querySelector('[data-rough-note-root]')).toHaveAttribute(
      'data-stroke-count',
      '1'
    );

    await user.click(screen.getByRole('button', { name: 'Clear drawing' }));
    await user.click(screen.getByRole('button', { name: 'Clear all' }));
    expect(document.querySelector('[data-rough-note-root]')).toHaveAttribute(
      'data-stroke-count',
      '0'
    );
    await waitFor(async () =>
      expect((await loadDrawing('/'))?.strokes).toEqual([])
    );
  });
});
