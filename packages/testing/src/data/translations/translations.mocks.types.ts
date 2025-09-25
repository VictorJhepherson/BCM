import {
  Translation,
  TranslationAddDTO,
  TranslationEditDTO,
  TranslationFilterDTO,
} from '@shared/models';
import { Types } from 'mongoose';
import { DataMock } from '../common/common.mocks.types';

export type TranslationMockRef = {
  projectId: Types.ObjectId;
  languageId: Types.ObjectId;
};

export type TranslationMockBody = {
  add: TranslationAddDTO;
  edit: TranslationEditDTO;
};

export type TranslationMockData = Partial<Translation>;

export type TranslationMockFilter = TranslationFilterDTO;

export type TranslationMock = DataMock<
  TranslationMockRef,
  TranslationMockBody,
  TranslationMockData,
  TranslationMockFilter
>;
