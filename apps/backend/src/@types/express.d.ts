import { TUserPayload } from '@bcm/models';

declare global {
  namespace Express {
    interface Request {
      user?: TUserPayload;
    }
  }
}
