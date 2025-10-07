import { TOptionalArgs } from '@bcm/models';

export type TRunProps<T, A = void> = {
  fn: (...args: TOptionalArgs<A>) => Promise<T>;
};

export type TRunOptions = {
  referrer: string;
};
