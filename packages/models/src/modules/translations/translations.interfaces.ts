import {
  IPaginationFilter,
  IPaginationQuery,
  TStringTree,
  WorkflowStatus,
} from '@/common';
import { TTranslationDraft } from '@/modules/translations';
import { Types } from 'mongoose';

export interface ITranslationEntity {
  locale: string;
  active: boolean;
  status: WorkflowStatus;
  project: Types.ObjectId;
  translations: TStringTree;
  drafts: TTranslationDraft[];
}

export interface ITranslationParams {
  _id: Types.ObjectId;
}

export interface ITranslationQuery extends IPaginationQuery {
  locale?: string;
  active?: boolean;
  status?: WorkflowStatus;
  project?: Types.ObjectId;
}

export interface ITranslationFilter
  extends Omit<ITranslationQuery, keyof IPaginationQuery> {}

export interface ITranslationFilterPG
  extends ITranslationFilter,
    IPaginationFilter {}

export interface IUTranslationFilter
  extends ITranslationParams,
    Omit<ITranslationQuery, keyof IPaginationQuery> {}

export interface IUTranslationFilterPG
  extends ITranslationParams,
    IUTranslationFilter,
    IPaginationFilter {}
