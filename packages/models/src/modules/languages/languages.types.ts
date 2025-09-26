import { HydratedDocument } from 'mongoose';
import { MongoPayload, WithPagination } from '../..';
import { ILanguage } from './languages.interfaces';
import { LanguageEntity } from './languages.schemas';

export type Language = HydratedDocument<LanguageEntity>;

export type LanguagePayload = ILanguage & MongoPayload;

export type MappedLanguage = WithPagination<LanguagePayload>;
