import type { RequestHandler } from 'express';

function readRequestOrigin(origin: string | undefined, referer: string | undefined) {
  if (origin) {
    try {
      return new URL(origin).origin;
    } catch {
      return null;
    }
  }
  if (referer) {
    try {
      return new URL(referer).origin;
    } catch {
      return null;
    }
  }
  return null;
}

export function createOriginGuard(options: {
  allowedOrigins: ReadonlySet<string>;
  requireOrigin: boolean;
}): RequestHandler {
  return (request, response, next) => {
    const requestOrigin = readRequestOrigin(
      request.get('origin'),
      request.get('referer')
    );
    if (!requestOrigin && !options.requireOrigin) {
      next();
      return;
    }
    if (!requestOrigin || !options.allowedOrigins.has(requestOrigin)) {
      response.status(403).json({
        message: 'This request did not come from an approved website.'
      });
      return;
    }
    next();
  };
}
