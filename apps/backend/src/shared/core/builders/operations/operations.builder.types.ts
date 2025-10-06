import { TGenericFn } from '@bcm/models';

export type TExecuteOptions<A> = {
  transformers?: TGenericFn<any, A>[];
};
