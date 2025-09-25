import {
  AddTranslationDTO,
  EditTranslationDTO,
  Translation,
} from '@shared/models';
import { Types } from 'mongoose';
import { DataMock } from '../common/common.mocks.types';

export type TranslationMockRef = {
  projectId: Types.ObjectId;
  languageId: Types.ObjectId;
};

export type TranslationMockBody = {
  add: AddTranslationDTO;
  edit: EditTranslationDTO;
};

export type TranslationMockData = Partial<Translation>;

export type TranslationMockFilter = any;

export type TranslationMock = DataMock<
  TranslationMockRef,
  TranslationMockBody,
  TranslationMockData,
  TranslationMockFilter
>;
