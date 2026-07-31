import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useReducer } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { DrawingToolbar } from '../../src/features/rough-note-drawing/components/RoughNoteDrawing/DrawingToolbar';
import { MobileToolDrawer } from '../../src/features/rough-note-drawing/components/RoughNoteDrawing/MobileToolDrawer';
import { drawingReducer } from '../../src/features/rough-note-drawing/state/drawingReducer';
import type { DrawingState } from '../../src/features/rough-note-drawing/types/drawing';
import { createDrawingState, createStroke } from '../helpers/drawingFixtures';

function ToolbarHarness({ initial }: { initial?: Partial<DrawingState> }) {
  const [state, dispatch] = useReducer(
    drawingReducer,
    createDrawingState(initial)
  );
  return (
    <>
      <DrawingToolbar state={state} dispatch={dispatch} />
      <output data-testid="stroke-count">{state.strokes.length}</output>
      <output data-testid="toolbar-position">
        {state.toolbarPosition
          ? `${state.toolbarPosition.x},${state.toolbarPosition.y}`
          : 'default'}
      </output>
    </>
  );
}

function MobileHarness() {
  const [state, dispatch] = useReducer(
    drawingReducer,
    createDrawingState({ isToolbarCollapsed: false })
  );
  return <MobileToolDrawer state={state} dispatch={dispatch} />;
}

function reducedMotionMatchMedia(query: string): MediaQueryList {
  return {
    matches: query.includes('prefers-reduced-motion'),
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn()
  };
}

describe('DrawingToolbar', () => {
  it('selects every custom drawing tool and updates the active state', async () => {
    const user = userEvent.setup();
    render(<ToolbarHarness />);

    for (const tool of ['pen', 'highlighter', 'eraser', 'pencil']) {
      const button = screen.getByRole('button', { name: `Use ${tool}` });
      await user.click(button);
      expect(button).toHaveAttribute('aria-pressed', 'true');
    }
  });

  it('selects colours with the reference ring/check state', async () => {
    const user = userEvent.setup();
    render(<ToolbarHarness />);
    const red = screen.getByRole('radio', { name: 'Red' });
    await user.click(red);
    expect(red).toHaveAttribute('aria-checked', 'true');
    expect(red.querySelector('svg')).toBeInTheDocument();
  });

  it('restores each tool’s last-used size', async () => {
    const user = userEvent.setup();
    render(<ToolbarHarness />);
    const slider = screen.getByRole('slider', { name: 'Stroke width' });

    fireEvent.change(slider, { target: { value: '8' } });
    await user.click(screen.getByRole('button', { name: 'Use highlighter' }));
    expect(slider).toHaveValue('20');
    fireEvent.change(slider, { target: { value: '34' } });
    await user.click(screen.getByRole('button', { name: 'Use pencil' }));
    expect(slider).toHaveValue('8');
    await user.click(screen.getByRole('button', { name: 'Use highlighter' }));
    expect(slider).toHaveValue('34');
  });

  it('hides and shows drawings without clearing them', async () => {
    const user = userEvent.setup();
    render(<ToolbarHarness initial={{ strokes: [createStroke()] }} />);
    await user.click(screen.getByRole('button', { name: 'Hide drawing' }));
    expect(
      screen.getByRole('button', { name: 'Show drawing' })
    ).toBeInTheDocument();
    expect(screen.getByTestId('stroke-count')).toHaveTextContent('1');
  });

  it('uses a paper confirmation before clearing and keeps clear undoable', async () => {
    const user = userEvent.setup();
    render(<ToolbarHarness initial={{ strokes: [createStroke()] }} />);
    await user.click(screen.getByRole('button', { name: 'Clear drawing' }));
    expect(screen.getByText('Clear your rough notes?')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Clear all' }));
    expect(screen.getByTestId('stroke-count')).toHaveTextContent('0');

    await user.click(screen.getByRole('button', { name: 'Undo' }));
    expect(screen.getByTestId('stroke-count')).toHaveTextContent('1');
  });

  it('collapses to the pencil disk and expands again', async () => {
    vi.mocked(window.matchMedia).mockImplementation(reducedMotionMatchMedia);
    const user = userEvent.setup();
    render(<ToolbarHarness initial={{ toolbarPosition: { x: 160, y: 90 } }} />);
    await user.click(screen.getByRole('button', { name: 'Collapse tools' }));
    const expand = screen.getByRole('button', { name: 'Expand tools' });
    expect(expand).toBeInTheDocument();
    expect(expand).not.toHaveAttribute('style');
    await user.click(expand);
    expect(screen.getByRole('toolbar', { name: 'Drawing tools' })).toBeVisible();
  });

  it('moves only from the handle and double-click resets its position', () => {
    render(<ToolbarHarness />);
    expect(screen.getByTestId('drawing-toolbar')).toHaveAttribute(
      'data-cursor',
      'pointer'
    );
    const handle = screen.getByRole('button', {
      name: 'Move drawing toolbar'
    });
    expect(handle).toHaveAttribute('data-cursor', 'grab');
    fireEvent.pointerDown(handle, {
      pointerId: 7,
      pointerType: 'mouse',
      button: 0,
      clientX: 10,
      clientY: 10
    });
    fireEvent.pointerMove(handle, {
      pointerId: 7,
      pointerType: 'mouse',
      clientX: 90,
      clientY: 70
    });
    fireEvent.pointerUp(handle, { pointerId: 7, pointerType: 'mouse' });
    expect(screen.getByTestId('toolbar-position')).toHaveTextContent('80,60');
    expect(screen.getByTestId('drawing-toolbar')).toHaveStyle({
      transform: 'scale(var(--toolbar-scale))',
      transformOrigin: 'top left'
    });

    fireEvent.doubleClick(handle);
    expect(screen.getByTestId('toolbar-position')).toHaveTextContent('default');
  });
});

describe('MobileToolDrawer', () => {
  it('switches reliably between Draw and Browse modes', async () => {
    const user = userEvent.setup();
    render(<MobileHarness />);
    expect(screen.getByTestId('mobile-drawing-toolbar')).toHaveAttribute(
      'data-cursor',
      'pointer'
    );
    const mode = screen.getByRole('button', {
      name: 'Switch to browse mode'
    });
    expect(mode).toHaveAttribute('aria-pressed', 'true');
    await user.click(mode);
    expect(
      screen.getByRole('button', { name: 'Switch to draw mode' })
    ).toHaveTextContent('Browse');
  });
});
