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
//#endregion UTILS

//#region GENERICS
export type PartialField<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

export type PromiseFn<T> = () => Promise<T>;
//#endregion GENERICS
