import { Transform } from '@shared/models';

export type ExecutorOptions = {
  referrer: string;
};

export type BuildOptions = {
  transformers?: Transform<any, any>[];
};
