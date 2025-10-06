import { TPagination, TSort, TSortOrder } from '@/common/common.types';

export interface IPaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: TSortOrder;
}

export interface IPaginationFilter {
  sort: TSort;
  pagination: TPagination;
}
