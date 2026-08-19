import { createHash, timingSafeEqual } from 'node:crypto';
import { Router } from 'express';
import type { RuntimeConfig } from '../config.js';
import type { MaintenanceRunner } from '../types.js';

export interface MaintenanceRouteDependencies {
  config: Pick<RuntimeConfig, 'operations'>;
  runner: MaintenanceRunner;
  now?: () => Date;
}

function digest(value: string): Buffer {
  return createHash('sha256').update(value).digest();
}

function authorized(header: string | undefined, secret: string): boolean {
  if (!header?.startsWith('Bearer ')) return false;
  const supplied = header.slice('Bearer '.length);
  if (!supplied) return false;
  return timingSafeEqual(digest(supplied), digest(secret));
}

export function createMaintenanceRouter(
  dependencies: MaintenanceRouteDependencies
): Router {
  const router = Router();
  const now = dependencies.now ?? (() => new Date());

  router.post('/', async (request, response, next) => {
    response.set('Cache-Control', 'no-store');
    if (!authorized(request.get('authorization'), dependencies.config.operations.maintenanceSecret)) {
      response.set('WWW-Authenticate', 'Bearer');
      response.status(401).json({ message: 'Unauthorized.' });
      return;
    }

    try {
      const result = await dependencies.runner.run(now());
      response.json({ status: 'completed', ...result });
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'MAINTENANCE_LOCKED'
      ) {
        response.status(409).json({ message: 'Maintenance is already running.' });
        return;
      }
      next(error);
    }
  });

  return router;
}
