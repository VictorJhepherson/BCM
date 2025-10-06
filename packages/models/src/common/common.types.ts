import { GROUPS, SCOPES } from '@/common/common.constants';
import { FlattenMaps, Require_id, Types } from 'mongoose';

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

export enum WorkflowStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}
//#endregion ENUMS

//#region UTILS
export type TGroup = (typeof GROUPS)[number];
export type TScope = (typeof SCOPES)[number];

export type TUserPayload = {
  name: string;
  userId: string;
  groups: string[];
  scopes: string[];
};

export type TStringTree = {
  [key: string]: string | TStringTree;
};

export type TWithId<T> = Omit<T, '_id'> & {
  id: Types.ObjectId;
};

export type TSortOrder = 'ASC' | 'DESC';
export type TSort = {
  by: string;
  order: TSortOrder;
};

export type TPagination = {
  page: number;
  skip: number;
  limit: number;
};

export type TWithPagination<T> = {
  data: T[];
  sort: TSort;
  pagination: Omit<TPagination, 'skip'> & { total: number };
};
//#endregion UTILS

//#region GENERICS
export type TPartialField<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

export type TRequiredField<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

export type TBody<P> = { payload: P };
export type TQuery<T, P = void> = P extends void
  ? { filter: T }
  : { filter: T; payload: P };

export type TElementType<T> = T extends (infer U)[] ? U : T;

export type TOptionalArgs<A> = {} extends A ? [args?: A] : [args: A];

export type TGenericFn<T, A> = (args: A) => T;
export type TPromiseFn<T, A = void> = A extends void
  ? () => Promise<T>
  : (args: A) => Promise<T>;

export type TWithLean<T> = FlattenMaps<Require_id<T>> & {
  createdAt: Date;
  updatedAt: Date;
};
//#endregion GENERICS
