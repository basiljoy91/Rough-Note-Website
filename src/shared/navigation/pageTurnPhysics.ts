export const pageTurnDuration = 1480;

const curlWidth = 0.26;

export type TurnDirection = 'next' | 'previous';

export type TurningCanvas = {
  element: HTMLCanvasElement;
  front: HTMLElement;
  source: HTMLCanvasElement;
};

type CurlPoint = {
  angle: number;
  depth: number;
  x: number;
};

type CurlColumn = {
  angle: number;
  depth: number;
  destinationLeft: number;
  destinationWidth: number;
  normalizedCenter: number;
  sourceLeft: number;
  sourceWidth: number;
};

const curlColumnsCache = new Map<string, CurlColumn[]>();
const MAX_CACHED_CURL_FRAMES = 72;

export const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(maximum, Math.max(minimum, value));

export const easePageTurn = (progress: number) =>
  progress < 0.5
    ? 2 * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 2) / 2;

const getCurlPoint = (
  position: number,
  progress: number,
  direction: TurnDirection
): CurlPoint => {
  const radius = curlWidth / Math.PI;
  const mirroredPosition = direction === 'next' ? position : 1 - position;
  const foldFront = 1 - progress * (1 + curlWidth);
  const distance = mirroredPosition - foldFront;
  let angle = 0;
  let mappedPosition = mirroredPosition;

  if (distance > 0 && distance < curlWidth) {
    angle = distance / radius;
    mappedPosition = foldFront + radius * Math.sin(angle);
  } else if (distance >= curlWidth) {
    angle = Math.PI;
    mappedPosition = foldFront - (distance - curlWidth);
  }

  return {
    angle,
    depth: radius * (1 - Math.cos(angle)),
    x: direction === 'next' ? mappedPosition : 1 - mappedPosition
  };
};

/**
 * The Product Showcase's column-warp page curl. Route transitions deliberately
 * use this same renderer so the fold, back face, edge highlight, and moving
 * contact shadow have one visual source of truth.
 */
export const drawPageCurl = (
  turningCanvas: TurningCanvas,
  progress: number,
  direction: TurnDirection
) => {
  const { element, source } = turningCanvas;
  const context = element.getContext('2d');
  if (!context) return;

  const width = element.width;
  const height = element.height;
  const normalizedProgress = clamp(progress, 0, 1);
  context.clearRect(0, 0, width, height);

  const flatBoundary = clamp(
    1 - normalizedProgress * (1 + curlWidth),
    0,
    1
  );
  const flatBoundaryPercent = flatBoundary * 100;
  const turnStrength = Math.sin(normalizedProgress * Math.PI);
  const edgeBend = turnStrength * 4.25;
  const edgeAt = (offset: number) =>
    clamp(flatBoundaryPercent + edgeBend * offset, 0, 100);
  const edgeTop = edgeAt(0.15);
  const edgeUpper = edgeAt(0.95);
  const edgeMiddle = edgeAt(0.35);
  const edgeLower = edgeAt(-0.5);
  const edgeBottom = edgeAt(-0.85);

  if (direction === 'next') {
    turningCanvas.front.style.clipPath = `polygon(0 0, ${edgeTop}% 0, ${edgeUpper}% 20%, ${edgeMiddle}% 50%, ${edgeLower}% 80%, ${edgeBottom}% 100%, 0 100%)`;
    turningCanvas.front.style.filter = `drop-shadow(${8 + turnStrength * 17}px 2px ${7 + turnStrength * 13}px rgba(55, 35, 19, ${0.12 + turnStrength * 0.24}))`;
  } else {
    turningCanvas.front.style.clipPath = `polygon(${100 - edgeTop}% 0, 100% 0, 100% 100%, ${100 - edgeBottom}% 100%, ${100 - edgeLower}% 80%, ${100 - edgeMiddle}% 50%, ${100 - edgeUpper}% 20%)`;
    turningCanvas.front.style.filter = `drop-shadow(${-8 - turnStrength * 17}px 2px ${7 + turnStrength * 13}px rgba(55, 35, 19, ${0.12 + turnStrength * 0.24}))`;
  }

  if (normalizedProgress <= 0.0001 || normalizedProgress >= 0.9999) return;

  const foldFront = 1 - normalizedProgress * (1 + curlWidth);
  const foldPosition =
    (direction === 'next' ? foldFront : 1 - foldFront) * width;
  const shadowWidth = width * (0.075 + turnStrength * 0.085);
  const shadow = context.createLinearGradient(
    foldPosition - shadowWidth,
    0,
    foldPosition + shadowWidth,
    0
  );

  shadow.addColorStop(0, 'rgba(49, 31, 17, 0)');
  shadow.addColorStop(0.43, `rgba(49, 31, 17, ${0.08 * turnStrength})`);
  shadow.addColorStop(0.56, `rgba(49, 31, 17, ${0.31 * turnStrength})`);
  shadow.addColorStop(1, 'rgba(49, 31, 17, 0)');
  context.fillStyle = shadow;
  context.fillRect(0, 0, width, height);

  const sourceStep = Math.max(2, Math.ceil(width / 620));
  // Quantizing geometry to a sub-frame interval is visually indistinguishable
  // at 60 Hz, while letting every route/story turn reuse the expensive column
  // mapping and depth sort instead of rebuilding it on each paint.
  const progressBucket = Math.round(normalizedProgress * 240);
  const cacheKey = `${width}:${sourceStep}:${direction}:${progressBucket}`;
  let columns = curlColumnsCache.get(cacheKey);

  if (!columns) {
    const geometryProgress = progressBucket / 240;
    columns = [];
    for (let sourceLeft = 0; sourceLeft < width; sourceLeft += sourceStep) {
      const sourceWidth = Math.min(sourceStep, width - sourceLeft);
      const sourceRight = sourceLeft + sourceWidth;
      const normalizedCenter = (sourceLeft + sourceWidth / 2) / width;
      const leftPoint = getCurlPoint(sourceLeft / width, geometryProgress, direction);
      const rightPoint = getCurlPoint(sourceRight / width, geometryProgress, direction);
      const centerPoint = getCurlPoint(normalizedCenter, geometryProgress, direction);
      const destinationStart = leftPoint.x * width;
      const destinationEnd = rightPoint.x * width;

      columns.push({
        angle: centerPoint.angle,
        depth: centerPoint.depth,
        destinationLeft: Math.min(destinationStart, destinationEnd) - 0.8,
        destinationWidth: Math.max(1.25, Math.abs(destinationEnd - destinationStart) + 1.6),
        normalizedCenter,
        sourceLeft,
        sourceWidth
      });
    }
    columns.sort((left, right) => left.depth - right.depth);
    if (curlColumnsCache.size >= MAX_CACHED_CURL_FRAMES) {
      curlColumnsCache.delete(curlColumnsCache.keys().next().value ?? '');
    }
    curlColumnsCache.set(cacheKey, columns);
  }

  columns.forEach((column) => {
    if (
      column.angle <= 0.0001 ||
      column.destinationLeft > width + 3 ||
      column.destinationLeft + column.destinationWidth < -3
    ) {
      return;
    }

    const fold = Math.sin(column.angle);
    const isReverseSide = column.angle > Math.PI / 2;
    const verticalScale = 1 - fold * 0.025;
    const destinationHeight = height * verticalScale;
    const paperRipple =
      fold *
      Math.sin(
        (column.normalizedCenter * 1.8 + normalizedProgress * 0.65) *
          Math.PI
      ) *
      Math.max(0.75, height * 0.0015);
    const destinationTop = (height - destinationHeight) / 2 + paperRipple;

    context.drawImage(
      source,
      column.sourceLeft,
      0,
      column.sourceWidth,
      height,
      column.destinationLeft,
      destinationTop,
      column.destinationWidth,
      destinationHeight
    );

    if (isReverseSide) {
      const reverseAmount = clamp(
        (column.angle - Math.PI / 2) / (Math.PI / 2),
        0,
        1
      );
      context.fillStyle = `rgba(247, 240, 223, ${0.7 + reverseAmount * 0.18})`;
      context.fillRect(
        column.destinationLeft,
        destinationTop,
        column.destinationWidth,
        destinationHeight
      );
    }

    const foldShade = fold * (isReverseSide ? 0.2 : 0.3);
    if (foldShade > 0.002) {
      context.fillStyle = `rgba(64, 42, 23, ${foldShade})`;
      context.fillRect(
        column.destinationLeft,
        destinationTop,
        column.destinationWidth,
        destinationHeight
      );
    }

    const highlight = Math.max(0, Math.sin(column.angle * 2)) * 0.18;
    if (highlight > 0.002) {
      context.fillStyle = `rgba(255, 254, 243, ${highlight})`;
      context.fillRect(
        column.destinationLeft,
        destinationTop,
        column.destinationWidth,
        destinationHeight
      );
    }
  });

  const freeEdgePosition = direction === 'next' ? 1 : 0;
  const freeEdge = getCurlPoint(
    freeEdgePosition,
    normalizedProgress,
    direction
  );
  const freeEdgeX = freeEdge.x * width;

  if (freeEdgeX > -3 && freeEdgeX < width + 3) {
    const edgeGradient = context.createLinearGradient(
      freeEdgeX - 4,
      0,
      freeEdgeX + 4,
      0
    );
    edgeGradient.addColorStop(0, 'rgba(47, 31, 17, 0)');
    edgeGradient.addColorStop(0.47, 'rgba(47, 31, 17, 0.32)');
    edgeGradient.addColorStop(0.58, 'rgba(255, 255, 245, 0.72)');
    edgeGradient.addColorStop(1, 'rgba(255, 255, 245, 0)');
    context.fillStyle = edgeGradient;
    context.fillRect(freeEdgeX - 4, 0, 8, height);
  }
};
