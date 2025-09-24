import { DeleteResult } from 'mongoose';
import { AddLanguageDTO, EditLanguageDTO } from './languages.dtos';
import { Language, LanguageFilter, MappedLanguage } from './languages.types';

export interface ILanguage {
  language: string;
}

export interface ILanguageRepository {
  findMany(): Promise<Language[]>;
  create(dto: AddLanguageDTO): Promise<Language>;
  update(
    filter: LanguageFilter,
    dto: EditLanguageDTO,
  ): Promise<Language | null>;
  deleteOne(filter: LanguageFilter): Promise<DeleteResult>;
}

export interface ILanguageService {
  getAll(): Promise<MappedLanguage[]>;
  addLanguage(dto: AddLanguageDTO): Promise<Language>;
  editLanguage(filter: LanguageFilter, dto: EditLanguageDTO): Promise<Language>;
  deleteLanguage(filter: LanguageFilter): Promise<void>;
}

export interface ILanguageController {
  getAll(): Promise<MappedLanguage[]>;
  addLanguage(dto: AddLanguageDTO): Promise<Language>;
  editLanguage(
    _id: LanguageFilter['_id'],
    dto: EditLanguageDTO,
  ): Promise<Language>;
  deleteLanguage(_id: LanguageFilter['_id']): Promise<void>;
}

export interface ILanguageMapper {
  mapLanguages(languages: Language[]): MappedLanguage[];
}
