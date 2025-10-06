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

/** Only for pagination pipe mapping */
interface IProjectFilterPG extends IProjectQuery, IPaginationFilter {}
