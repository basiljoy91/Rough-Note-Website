import { describe, expect, it, vi } from 'vitest';
import {
  captureDrawingPoint,
  isInteractiveTarget,
  normalizePathname,
  resolveDocumentPoint,
  strokeIntersectsEraser
} from '../../src/features/rough-note-drawing/utils/coordinateUtils';
import { createStroke } from '../helpers/drawingFixtures';

describe('coordinate utilities', () => {
  it('normalizes static HTML and application routes to stable keys', () => {
    expect(normalizePathname('/html/index.html')).toBe('/');
    expect(normalizePathname('/html/portfolio.html/')).toBe('/portfolio');
    expect(normalizePathname('//about///')).toBe('/about');
  });

  it('recognizes protected interactive descendants', () => {
    const button = document.createElement('button');
    const icon = document.createElement('span');
    button.append(icon);
    document.body.append(button);
    expect(isInteractiveTarget(icon)).toBe(true);

    const section = document.createElement('section');
    section.dataset.drawingExclusion = '';
    section.append(document.createElement('span'));
    document.body.append(section);
    expect(isInteractiveTarget(section.firstElementChild)).toBe(true);
  });

  it('captures document and element-relative point coordinates', () => {
    vi.spyOn(window, 'scrollX', 'get').mockReturnValue(50);
    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(80);
    const anchor = document.createElement('section');
    vi.spyOn(anchor, 'getBoundingClientRect').mockReturnValue({
      left: 10,
      top: 20,
      width: 200,
      height: 100,
      right: 210,
      bottom: 120,
      x: 10,
      y: 20,
      toJSON: () => ({})
    });
    const event = new PointerEvent('pointermove', {
      clientX: 110,
      clientY: 70,
      pressure: 0
    });
    const point = captureDrawingPoint(event, anchor);

    expect(point).toMatchObject({
      x: 160,
      y: 150,
      pressure: 0.5,
      relativeX: 0.5,
      relativeY: 0.5
    });
    expect(
      resolveDocumentPoint(point, anchor.getBoundingClientRect())
    ).toMatchObject({ x: 160, y: 150 });
  });

  it('detects a vector stroke intersected by the eraser path', () => {
    const stroke = createStroke();
    expect(strokeIntersectsEraser(stroke, { x: 40, y: 50 }, 20)).toBe(true);
    expect(strokeIntersectsEraser(stroke, { x: 300, y: 300 }, 20)).toBe(
      false
    );
  });
});
