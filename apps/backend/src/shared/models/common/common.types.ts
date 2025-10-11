import { TFormatting } from '@bcm/helpers';
import { TUserPayload } from '@bcm/models';

export type THeaders = Record<string, string | string[] | undefined>;

export type TContext = {
  user: TUserPayload;
  headers: THeaders;
  formatting: TFormatting;
};
