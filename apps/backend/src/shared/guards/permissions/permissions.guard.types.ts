import { TUserPayload } from '@bcm/models';

export type TPermissionOptions = {
  user: TUserPayload;
  handler: Function;
};
