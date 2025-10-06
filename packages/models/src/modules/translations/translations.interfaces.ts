import { IPaginationQuery, TStringTree, WorkflowStatus } from '@/common';
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

export interface ITranslationParam {
  _id: Types.ObjectId;
}

export interface ITranslationQuery extends IPaginationQuery {
  locale?: string;
  active?: boolean;
  status?: WorkflowStatus;
  project?: Types.ObjectId;
}

export interface ITranslationFilter extends ITranslationQuery {}
export interface IUTranslationFilter
  extends ITranslationParam,
    ITranslationQuery {}
