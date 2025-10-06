import { IPaginationFilter } from '@/common';
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

export interface IProjectQuery extends IPaginationFilter {
  active?: boolean;
}

export interface IProjectFilter extends IProjectQuery {}
export interface IUProjectFilter extends IProjectParams, IProjectQuery {}
