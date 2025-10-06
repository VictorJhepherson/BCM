import { IPaginationFilter, IPaginationQuery } from '@/common';
import { Types } from 'mongoose';

export interface IProjectEntity {
  name: string;
  active: boolean;
  locales: string[];
  description: string;
  attributes: Record<string, boolean | number | string | string[]>;
}

export interface IProjectParams {
  _id: Types.ObjectId;
}

export interface IProjectQuery extends IPaginationQuery {
  active?: boolean;
}

export interface IProjectFilter extends IProjectFilterPG {}
export interface IUProjectFilter extends IProjectParams, IProjectFilterPG {}

/** Omit unused paging data in filters, keeping only data remapped by PaginationPipe */
interface IProjectFilterPG
  extends Omit<IProjectQuery, keyof IPaginationQuery>,
    IPaginationFilter {}
