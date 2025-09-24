export enum Environment {
  DEV = 'DEV',
  SIT = 'SIT',
  UAT = 'UAT',
  PROD = 'PROD',
  DEBUG = 'DEBUG',
}

export type PartialField<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

export type PromiseFn<T> = () => Promise<T>;

export type ExecuteProps<T> = {
  fn: PromiseFn<T>;
};
