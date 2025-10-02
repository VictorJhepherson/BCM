import { ClientSession } from 'mongoose';

type OptionalArgs<A> = {} extends A ? [args?: A] : [args: A];
export type ExecuteProps<T, A = Partial<ClientSession>> = {
  fn: (...args: OptionalArgs<A>) => Promise<T>;
};

export type ExecuteOptions = {
  referrer: string;
};
