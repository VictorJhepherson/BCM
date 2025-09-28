import { FlattenMaps, Require_id, Types } from 'mongoose';
import { GROUPS, SCOPES } from './common.constants';

//#region ENUMS
export enum Environment {
  DEV = 'DEV',
  SIT = 'SIT',
  UAT = 'UAT',
  PROD = 'PROD',
}

export enum Logging {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
}

export enum LoggingLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
}
//#endregion ENUMS

//#region UTILS
export type Group = (typeof GROUPS)[number];
export type Scope = (typeof SCOPES)[number];

export type SortOrder = 'ASC' | 'DESC';

export type Sort = {
  by: string;
  order: SortOrder;
};

export type Pagination = {
  page: number;
  skip: number;
  limit: number;
};

export type WithPagination<T> = {
  data: T[];
  sort: Sort;
  pagination: Omit<Pagination, 'skip'> & { total: number };
};

export type UserPayload = {
  name: string;
  userId: string;
  groups: string[];
  scopes: string[];
};

export type WithId<T> = Omit<T, '_id'> & {
  id: Types.ObjectId;
};
//#endregion UTILS

//#region GENERICS
export type PartialField<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

export type RequiredField<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

export type PromiseFn<T> = () => Promise<T>;

export type WithLean<T> = FlattenMaps<Require_id<T>> & {
  createdAt: Date;
  updatedAt: Date;
};
//#endregion GENERICS
