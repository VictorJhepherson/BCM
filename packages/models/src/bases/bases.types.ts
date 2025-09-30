import { ClientSession } from 'mongoose';

export type ExecuteProps<T> = {
  fn: (session?: ClientSession) => Promise<T>;
};

export type WithTransaction<T> = {
  fn: (session: ClientSession) => Promise<T>;
  session: ClientSession;
};
