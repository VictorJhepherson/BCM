import { HydratedDocument } from 'mongoose';
import { WithId, WithLean } from '../..';
import { TranslationEntity } from './translations.schemas';

export type Translation = HydratedDocument<TranslationEntity>;
export type FlatTranslation = WithLean<TranslationEntity>;

export type MappedTranslation = WithId<FlatTranslation>;

//#region UTILS
export type TranslationTree = {
  [key: string]: string | TranslationTree;
};
//#endregion UTILS
