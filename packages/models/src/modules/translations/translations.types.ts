import { HydratedDocument } from 'mongoose';
import {
  IPaginationFilter,
  ITranslationFilter,
  ITranslationRef,
  WithId,
  WithLean,
} from '../..';
import { TranslationEntity } from './translations.schemas';

export type Translation = HydratedDocument<TranslationEntity>;
export type FlatTranslation = WithLean<TranslationEntity>;

export type MappedTranslation = WithId<FlatTranslation>;

export type UFilterTranslation = ITranslationFilter & ITranslationRef;
export type UFilterTranslationPG = UFilterTranslation & IPaginationFilter;

//#region UTILS
export type TranslationTree = {
  [key: string]: string | TranslationTree;
};
//#endregion UTILS
