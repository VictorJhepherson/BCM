import { HydratedDocument, Types } from 'mongoose';
import { TranslationEntity } from './translations.schemas';

export type Translation = HydratedDocument<TranslationEntity>;

export type PopulateTranslation = Omit<Translation, 'languageId'> & {
  languageId: { _id: Types.ObjectId; language: string };
};

export type TranslationTree = {
  [key: string]: string | TranslationTree;
};

export type TranslationFilter = {
  projectId: Types.ObjectId;
  languageId: Types.ObjectId;
};

export type MappedTranslation = {
  language: string;
  translations: TranslationTree;
};
