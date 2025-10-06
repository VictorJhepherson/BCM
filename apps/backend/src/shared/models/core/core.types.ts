import { TOptionalArgs } from '@bcm/models';
import { ClientSession } from 'mongoose';

export type TRunProps<T, A = Partial<ClientSession>> = {
  fn: (...args: TOptionalArgs<A>) => Promise<T>;
};

export type TRunOptions = {
  referrer: string;
};
