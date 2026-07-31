import type { DrawingPoint, DrawingStroke } from '../types/drawing';

export const DRAWING_EXCLUSION_SELECTOR = `
  a,
  button,
  input,
  textarea,
  select,
  option,
  label,
  video,
  audio,
  iframe,
  [contenteditable="true"],
  [role="button"],
  [role="link"],
  [role="dialog"],
  [aria-modal="true"],
  [data-drawing-exclusion]
`;

export function isInteractiveTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return Boolean(target.closest(DRAWING_EXCLUSION_SELECTOR));
}

export function findDrawingAnchor(
  clientX: number,
  clientY: number
): HTMLElement | null {
  for (const element of document.elementsFromPoint(clientX, clientY)) {
    if (!(element instanceof HTMLElement)) continue;
    if (element.closest('[data-rough-note-root]')) continue;
    const anchor = element.closest<HTMLElement>('[data-rough-anchor]');
    if (anchor) return anchor;
  }
  return null;
}

export function getAnchorByKey(anchorKey: string): HTMLElement | null {
  for (const element of document.querySelectorAll<HTMLElement>(
    '[data-rough-anchor]'
  )) {
    if (element.dataset.roughAnchor === anchorKey) return element;
  }
  return null;
}

export function captureDrawingPoint(
  event: PointerEvent,
  anchor: HTMLElement | null
): DrawingPoint {
  const pressure =
    event.pressure && event.pressure > 0 ? event.pressure : 0.5;
  const point: DrawingPoint = {
    x: event.clientX + window.scrollX,
    y: event.clientY + window.scrollY,
    pressure: Math.min(1, Math.max(0.05, pressure)),
    timestamp: Math.round(event.timeStamp)
  };

  if (!anchor) return point;
  const rect = anchor.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return point;
  return {
    ...point,
    relativeX: (event.clientX - rect.left) / rect.width,
    relativeY: (event.clientY - rect.top) / rect.height
  };
}

export function resolveDocumentPoint(
  point: DrawingPoint,
  anchorRect: DOMRect | null
): Pick<DrawingPoint, 'x' | 'y' | 'pressure' | 'timestamp'> {
  if (
    anchorRect &&
    Number.isFinite(point.relativeX) &&
    Number.isFinite(point.relativeY)
  ) {
    return {
      x:
        anchorRect.left +
        window.scrollX +
        (point.relativeX as number) * anchorRect.width,
      y:
        anchorRect.top +
        window.scrollY +
        (point.relativeY as number) * anchorRect.height,
      pressure: point.pressure,
      timestamp: point.timestamp
    };
  }
  return {
    x: point.x,
    y: point.y,
    pressure: point.pressure,
    timestamp: point.timestamp
  };
}

export function resolveStrokePoints(stroke: DrawingStroke): DrawingPoint[] {
  const anchorRect = stroke.anchorKey
    ? getAnchorByKey(stroke.anchorKey)?.getBoundingClientRect() ?? null
    : null;
  return stroke.points.map((point) => resolveDocumentPoint(point, anchorRect));
}

export function distanceToSegment(
  point: Pick<DrawingPoint, 'x' | 'y'>,
  start: Pick<DrawingPoint, 'x' | 'y'>,
  end: Pick<DrawingPoint, 'x' | 'y'>
): number {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  if (dx === 0 && dy === 0) return Math.hypot(point.x - start.x, point.y - start.y);
  const progress = Math.min(
    1,
    Math.max(
      0,
      ((point.x - start.x) * dx + (point.y - start.y) * dy) /
        (dx * dx + dy * dy)
    )
  );
  return Math.hypot(
    point.x - (start.x + progress * dx),
    point.y - (start.y + progress * dy)
  );
}

export function strokeIntersectsEraser(
  stroke: DrawingStroke,
  point: Pick<DrawingPoint, 'x' | 'y'>,
  eraserSize: number
): boolean {
  const points = resolveStrokePoints(stroke);
  if (points.length === 0) return false;
  const radius = eraserSize / 2 + stroke.size / 2;
  if (points.length === 1) {
    return Math.hypot(point.x - points[0].x, point.y - points[0].y) <= radius;
  }
  for (let index = 1; index < points.length; index += 1) {
    if (distanceToSegment(point, points[index - 1], points[index]) <= radius) {
      return true;
    }
  }
  return false;
}

export function simplifyPoints(
  points: DrawingPoint[],
  minimumDistance = 0.55
): DrawingPoint[] {
  if (points.length <= 2) return points;
  const simplified = [points[0]];
  for (let index = 1; index < points.length - 1; index += 1) {
    const previous = simplified[simplified.length - 1];
    const current = points[index];
    if (Math.hypot(current.x - previous.x, current.y - previous.y) >= minimumDistance) {
      simplified.push(current);
    }
  }
  simplified.push(points.at(-1) as DrawingPoint);
  return simplified;
}

export function normalizePathname(pathname = window.location.pathname): string {
  let path = pathname.replace(/\/{2,}/g, '/').replace(/\/+$/, '');
  path = path.replace(/\/index\.html$/i, '/');
  path = path.replace(/^\/html(?=\/|$)/i, '');
  path = path.replace(/\.html$/i, '');
  return path || '/';
}
