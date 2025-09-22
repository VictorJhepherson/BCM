import {
  AddTranslationDTO,
  EditTranslationDTO,
  Translation,
} from '@shared/models';
import { Types } from 'mongoose';
import { DataMock } from '../common/common.mocks.types';

export type TranslationMockData = Partial<Translation>;
export type TranslationMockDTO = {
  add: AddTranslationDTO;
  edit: EditTranslationDTO;
};

export type TranslationMockFilter = {
  projectId: Types.ObjectId;
  languageId: Types.ObjectId;
};

export type TranslationMock = DataMock<
  TranslationMockDTO,
  TranslationMockData,
  TranslationMockFilter
>;
