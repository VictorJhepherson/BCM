import {
  IPagination,
  ITranslation,
  ITranslationFilter,
  ITranslationRef,
  Translation,
} from '@shared/models';
import { DataMock } from '../common/common.mocks.types';

export type TranslationMockRef = ITranslationRef;

export type TranslationMockBody = {
  add: ITranslation;
  edit: Partial<ITranslation>;
};

export type TranslationMockData = Partial<Translation>;

export type TranslationMockFilter = ITranslationFilter & IPagination;

export type TranslationMock = DataMock<
  TranslationMockRef,
  TranslationMockBody,
  TranslationMockData,
  TranslationMockFilter
>;
