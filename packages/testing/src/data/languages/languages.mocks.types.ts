import {
  FlatLanguage,
  ILanguage,
  ILanguageFilter,
  ILanguageFilterPG,
  ILanguageRef,
  RequiredField,
} from '@shared/models';
import {
  DataMock,
  MockPagination,
  MockSort,
} from '../common/common.mocks.types';

export type LanguageMockRef = ILanguageRef;

export type LanguageMockBody = {
  add: ILanguage;
  edit: Partial<ILanguage>;
  archive: RequiredField<Partial<ILanguage>, 'active'>;
};

export type LanguageMockData = Partial<FlatLanguage>;

export type LanguageMockFilter = {
  default: ILanguageFilter;
  pagination: ILanguageFilterPG;
  controller: ILanguageFilter & MockSort & MockPagination;
};

export type LanguageMock = DataMock<
  LanguageMockRef,
  LanguageMockBody,
  LanguageMockData,
  LanguageMockFilter
>;
