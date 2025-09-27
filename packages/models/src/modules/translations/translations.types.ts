import { HydratedDocument, Types } from 'mongoose';
import { ITranslation, MongoPayload, WithPagination } from '../..';
import { TranslationEntity } from './translations.schemas';

export type Translation = HydratedDocument<TranslationEntity>;
export type PopulateTranslation = Omit<Translation, 'language'> & {
  language: { _id: Types.ObjectId; name: string };
};

export type TranslationTree = {
  [key: string]: string | TranslationTree;
};

export type TranslationPayload = Omit<ITranslation, 'project' | 'language'> &
  MongoPayload & {
    language: string;
  };

export type MappedTranslation = WithPagination<TranslationPayload>;
