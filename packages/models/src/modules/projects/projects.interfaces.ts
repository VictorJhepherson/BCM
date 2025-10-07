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

export interface IProjectFilter
  extends Omit<IProjectQuery, keyof IPaginationQuery> {}

export interface IProjectFilterPG extends IProjectFilter, IPaginationFilter {}

export interface IUProjectFilter
  extends IProjectParams,
    Omit<IProjectQuery, keyof IPaginationQuery> {}

export interface IUProjectFilterPG
  extends IProjectParams,
    IUProjectFilter,
    IPaginationFilter {}
