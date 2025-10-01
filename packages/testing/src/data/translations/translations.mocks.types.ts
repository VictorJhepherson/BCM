import {
  FlatTranslation,
  ITranslation,
  ITranslationFilter,
  ITranslationFilterPG,
  ITranslationRef,
} from '@shared/models';
import {
  DataMock,
  MockPagination,
  MockSort,
} from '../common/common.mocks.types';

export type TranslationMockRef = ITranslationRef;

export type TranslationMockBody = {
  add: ITranslation;
  edit: Partial<ITranslation>;
};

export type TranslationMockData = Partial<FlatTranslation>;

export type TranslationMockFilter = {
  default: ITranslationFilter;
  pagination: ITranslationFilterPG;
  controller: ITranslationFilter & MockSort & MockPagination;
};

export type TranslationMock = DataMock<
  TranslationMockRef,
  TranslationMockBody,
  TranslationMockData,
  TranslationMockFilter
>;
