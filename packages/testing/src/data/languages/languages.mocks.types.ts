import {
  Language,
  LanguageAddDTO,
  LanguageEditDTO,
  LanguageFilterDTO,
} from '@shared/models';
import { Types } from 'mongoose';
import { DataMock } from '../common/common.mocks.types';

export type LanguageMockRef = {
  _id: Types.ObjectId;
};

export type LanguageMockBody = {
  add: LanguageAddDTO;
  edit: LanguageEditDTO;
};

export type LanguageMockData = Partial<Language>;

export type LanguageMockFilter = LanguageFilterDTO;

export type LanguageMock = DataMock<
  LanguageMockRef,
  LanguageMockBody,
  LanguageMockData,
  LanguageMockFilter
>;
