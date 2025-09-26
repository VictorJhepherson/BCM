import { UserPayload } from '@shared/models';

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
