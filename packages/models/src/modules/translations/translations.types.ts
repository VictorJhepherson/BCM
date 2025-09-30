import { HydratedDocument, Types } from 'mongoose';
import { WithId, WithLean } from '../..';
import { TranslationEntity } from './translations.schemas';

export type Translation = HydratedDocument<TranslationEntity>;
export type FlatTranslation = WithLean<TranslationEntity>;

export type PopulateTranslation = Omit<FlatTranslation, 'language'> & {
  language: { _id: Types.ObjectId; name: string };
};

export type MappedTranslation = WithId<
  Omit<FlatTranslation, 'project' | 'language'>
> & {
  language: string;
};

//#region UTILS
export type TranslationTree = {
  [key: string]: string | TranslationTree;
};
//#endregion UTILS
