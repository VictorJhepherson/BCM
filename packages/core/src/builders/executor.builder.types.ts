import { Transform } from '@shared/models';

export type BuildOptions = {
  transformers?: Transform<any, unknown>[];
};
