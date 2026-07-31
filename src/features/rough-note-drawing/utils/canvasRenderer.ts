import type { DrawingPoint, DrawingStroke } from '../types/drawing';
import { resolveStrokePoints } from './coordinateUtils';

interface ViewPoint extends DrawingPoint {
  x: number;
  y: number;
}

export function resizeCanvas(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const dpr = Math.min(4, Math.max(1, window.devicePixelRatio || 1));
  const width = Math.max(1, window.innerWidth);
  const height = Math.max(1, window.innerHeight);
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  const context = canvas.getContext('2d', { alpha: true });
  if (!context) throw new Error('Canvas 2D rendering is unavailable.');
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  return context;
}

export function clearCanvas(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D
): void {
  const dpr = Math.min(4, Math.max(1, window.devicePixelRatio || 1));
  context.save();
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
  context.restore();
}

function toViewPoints(stroke: DrawingStroke): ViewPoint[] {
  return resolveStrokePoints(stroke).map((point) => ({
    ...point,
    x: point.x - window.scrollX,
    y: point.y - window.scrollY
  }));
}

function isInViewport(points: ViewPoint[], padding: number): boolean {
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  return !(
    Math.max(...xs) < -padding ||
    Math.min(...xs) > window.innerWidth + padding ||
    Math.max(...ys) < -padding ||
    Math.min(...ys) > window.innerHeight + padding
  );
}

function traceSmoothedPath(
  context: CanvasRenderingContext2D,
  points: ViewPoint[]
): void {
  context.beginPath();
  context.moveTo(points[0].x, points[0].y);
  if (points.length === 2) {
    context.lineTo(points[1].x, points[1].y);
    return;
  }
  for (let index = 1; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    context.quadraticCurveTo(
      current.x,
      current.y,
      (current.x + next.x) / 2,
      (current.y + next.y) / 2
    );
  }
  const last = points.at(-1) as ViewPoint;
  context.lineTo(last.x, last.y);
}

export function renderStroke(
  context: CanvasRenderingContext2D,
  stroke: DrawingStroke
): void {
  const points = toViewPoints(stroke);
  if (points.length === 0 || !isInViewport(points, stroke.size * 2)) return;
  const averagePressure =
    points.reduce((sum, point) => sum + point.pressure, 0) / points.length;
  const pressureScale =
    stroke.tool === 'highlighter' ? 1 : 0.86 + averagePressure * 0.24;

  context.save();
  context.strokeStyle = stroke.color;
  context.fillStyle = stroke.color;
  context.globalAlpha = stroke.opacity;
  context.globalCompositeOperation =
    stroke.tool === 'highlighter' ? 'multiply' : 'source-over';
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.lineWidth = stroke.size * pressureScale;

  if (points.length === 1) {
    context.beginPath();
    context.arc(points[0].x, points[0].y, context.lineWidth / 2, 0, Math.PI * 2);
    context.fill();
    context.restore();
    return;
  }

  traceSmoothedPath(context, points);
  context.stroke();

  if (stroke.tool === 'pencil') {
    context.save();
    context.translate(0.28, -0.18);
    context.globalAlpha = 0.13;
    context.lineWidth = Math.max(0.65, stroke.size * 0.42);
    context.setLineDash([0.8, 1.45]);
    traceSmoothedPath(context, points);
    context.stroke();
    context.restore();
  }
  context.restore();
}

export function renderStrokes(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  strokes: DrawingStroke[]
): void {
  clearCanvas(canvas, context);
  for (const stroke of strokes) renderStroke(context, stroke);
}
