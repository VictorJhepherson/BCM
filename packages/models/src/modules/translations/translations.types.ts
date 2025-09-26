import { HydratedDocument, Types } from 'mongoose';
import { MongoPayload, WithPagination } from '../..';
import { TranslationEntity } from './translations.schemas';

export type Translation = HydratedDocument<TranslationEntity>;
export type PopulateTranslation = Omit<Translation, 'languageId'> & {
  languageId: { _id: Types.ObjectId; name: string };
};

export type TranslationTree = {
  [key: string]: string | TranslationTree;
};

export type TranslationPayload = MongoPayload & {
  active: boolean;
  language: string;
  translations: TranslationTree;
};

export type MappedTranslation = WithPagination<TranslationPayload>;
