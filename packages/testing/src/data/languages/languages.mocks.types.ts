import {
  FlatLanguage,
  ILanguage,
  ILanguageFilter,
  ILanguageRef,
  IPagination,
  RequiredField,
} from '@shared/models';
import { DataMock } from '../common/common.mocks.types';

export type LanguageMockRef = ILanguageRef;

export type LanguageMockBody = {
  add: ILanguage;
  edit: Partial<ILanguage>;
  archive: RequiredField<Partial<ILanguage>, 'active'>;
};

export type LanguageMockData = Partial<FlatLanguage>;

export type LanguageMockFilter = ILanguageFilter & IPagination;

export type LanguageMock = DataMock<
  LanguageMockRef,
  LanguageMockBody,
  LanguageMockData,
  LanguageMockFilter
>;
