import { ClientSession } from 'mongoose';
import { Pagination, Sort, SortOrder } from './common.types';

export interface IQueryOptions {
  session?: ClientSession;
}

export interface IPagination {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: SortOrder;
}

export interface IPaginationFilter {
  sort: Sort;
  pagination: Pagination;
}
