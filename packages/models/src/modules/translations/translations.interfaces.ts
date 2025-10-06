import { IPaginationFilter, TStringTree, WorkflowStatus } from '@/common';
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

export interface ITranslationQuery extends IPaginationFilter {
  locale?: string;
  active?: boolean;
  status?: WorkflowStatus;
  project?: Types.ObjectId;
}

export interface ITranslationFilter extends ITranslationQuery {}
export interface IUTranslationFilter
  extends ITranslationParams,
    ITranslationQuery {}
