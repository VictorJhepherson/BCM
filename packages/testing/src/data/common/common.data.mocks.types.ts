import { IPaginationFilter, IPaginationQuery, TUserPayload } from '@bcm/models';
import { Types } from 'mongoose';

export type TMockDatabase = {
  _id: Types.ObjectId;
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TMockSort = Pick<IPaginationQuery, 'sortBy' | 'sortOrder'> &
  Pick<IPaginationFilter, 'sort'>;

export type TMockPagination = Pick<IPaginationQuery, 'page' | 'limit'> &
  Pick<IPaginationFilter, 'pagination'>;

export type TMockHeaders = Record<string, string>;

export type TMockValues = {
  user: TUserPayload;
  headers: TMockHeaders;
  database: TMockDatabase;
  sort: TMockSort;
  pagination: TMockPagination;
};

export type TMockQueryFilter<D, U> = {
  united: U;
  default: D;
};
