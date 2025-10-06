import { TElementType, TGenericFn } from '@bcm/models';

export type TMapArg<F> = F extends (arg: infer A) => any ? A : never;
export type TMapRet<F> = F extends (arg: any) => infer R ? R : never;

export type TMapReturn<M, K extends keyof M> = TMapRet<M[K]>;

export type TMapProps<K, T> = {
  key: K;
  select?: keyof T;
};

export type TFWithSelect<T> = {
  select: keyof T;
  fn: TGenericFn<boolean, TElementType<T[keyof T]>>;
};

export type TFWithoutSelect<T> = {
  select?: undefined;
  fn: TGenericFn<boolean, T>;
};

export type TFilterProps<T> = TFWithSelect<T> | TFWithoutSelect<T>;
