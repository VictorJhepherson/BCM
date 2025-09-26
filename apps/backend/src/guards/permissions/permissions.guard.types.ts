import { UserPayload } from '@shared/models';

export type PermissionOptions = {
  user: UserPayload;
  handler: Function;
};
