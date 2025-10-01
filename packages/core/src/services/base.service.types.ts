import { ExecutorBuilder } from '../builders/executor.builder';

export type ExecutorProps<T> = {
  fn: (builder: ExecutorBuilder<T>) => Promise<T>;
};
