import { HydratedDocument, Types } from 'mongoose';
import { WithPagination } from '../..';
import { TranslationEntity } from './translations.schemas';

export type Translation = HydratedDocument<TranslationEntity>;
export type PopulateTranslation = Omit<Translation, 'languageId'> & {
  languageId: { _id: Types.ObjectId; name: string };
};

export type TranslationTree = {
  [key: string]: string | TranslationTree;
};

export type TranslationPayload = {
  language: string;
  translations: TranslationTree;
};

export type MappedTranslation = WithPagination<TranslationPayload>;
