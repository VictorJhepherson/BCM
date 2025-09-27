import { ClientSession, Connection } from 'mongoose';
import { PromiseFn } from '../common/common.types';

export type ExecuteProps<T> = {
  fn: PromiseFn<T>;
};

export type WithTransaction<T> = {
  fn: (session: ClientSession) => Promise<T>;
  connection: Connection;
};
