import { PromiseFn } from '../common/common.types';

export type ExecuteProps<T> = {
  fn: PromiseFn<T>;
};
