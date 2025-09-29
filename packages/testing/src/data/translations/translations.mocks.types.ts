import {
  FlatTranslation,
  IPagination,
  ITranslation,
  ITranslationFilter,
  ITranslationRef,
} from '@shared/models';
import { DataMock } from '../common/common.mocks.types';

export type TranslationMockRef = ITranslationRef;

export type TranslationMockBody = {
  add: ITranslation;
  edit: Partial<ITranslation>;
};

export type TranslationMockData = Partial<FlatTranslation>;

export type TranslationMockFilter = ITranslationFilter & IPagination;

export type TranslationMock = DataMock<
  TranslationMockRef,
  TranslationMockBody,
  TranslationMockData,
  TranslationMockFilter
>;
