import { TUserPayload } from '@bcm/models';
import { Request, Response } from 'express';

type TOthersType = Record<string, any>;
type TMockProps<Key extends string, T, O extends TOthersType = never> = {
  [K in Key]: T;
} & ([O] extends [never] ? {} : { others: O });

type TMockKind =
  | 'pipe'
  | 'guard'
  | 'mapper'
  | 'builder'
  | 'service'
  | 'provider'
  | 'strategy'
  | 'controller'
  | 'repository'
  | 'middleware';

export type TMockPropsOf<
  K extends TMockKind,
  T,
  O extends TOthersType = never,
> = TMockProps<K, T, O>;

export type TRequestOptions = {
  req?: Partial<Omit<Request, 'user'> & { user?: Partial<TUserPayload> }>;
  res?: Partial<Response>;
};
