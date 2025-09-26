import { UserPayload } from '@shared/models';
import { Request, Response } from 'express';

export type Options = {
  req?: Partial<Request & { user?: Partial<UserPayload> }>;
  res?: Partial<Response>;
};
