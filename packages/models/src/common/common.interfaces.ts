import { Pagination, Sort, SortOrder } from './common.types';

//#region UTILS
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
//#endregion UTILS
