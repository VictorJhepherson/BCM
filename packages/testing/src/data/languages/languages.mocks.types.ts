import { AddLanguageDTO, EditLanguageDTO, Language } from '@shared/models';
import { Types } from 'mongoose';
import { DataMock } from '../common/common.mocks.types';

export type LanguageMockData = Partial<Language>;
export type LanguageMockDTO = {
  add: AddLanguageDTO;
  edit: EditLanguageDTO;
};

export type LanguageMockFilter = {
  _id: Types.ObjectId;
};

export type LanguageMock = DataMock<
  LanguageMockDTO,
  LanguageMockData,
  LanguageMockFilter
>;
