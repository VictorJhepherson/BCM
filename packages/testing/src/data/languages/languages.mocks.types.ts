import { Language, LanguageAddDTO, LanguageEditDTO } from '@shared/models';
import { Types } from 'mongoose';
import { DataMock } from '../common/common.mocks.types';

export type LanguageMockData = Partial<Language>;
export type LanguageMockDTO = {
  add: LanguageAddDTO;
  edit: LanguageEditDTO;
};

export type LanguageMockFilter = {
  _id: Types.ObjectId;
};

export type LanguageMock = DataMock<
  LanguageMockDTO,
  LanguageMockData,
  LanguageMockFilter
>;
