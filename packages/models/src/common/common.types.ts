export type PartialField<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

export type PromiseFn<T> = () => Promise<T>;
