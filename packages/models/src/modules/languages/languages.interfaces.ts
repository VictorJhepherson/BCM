import { DeleteResult, Types } from 'mongoose';
import { IPaginationFilter, WithPagination } from '../..';
import {
  LanguageAddDTO,
  LanguageEditDTO,
  LanguageFilterDTO,
  LanguageRefDTO,
} from './languages.dtos';
import { Language, LanguagePayload, MappedLanguage } from './languages.types';

export interface ILanguage {
  name: string;
  active: boolean;
}

export interface ILanguageRef {
  _id: Types.ObjectId;
}

export interface ILanguageFilter extends IPaginationFilter {}

export interface ILanguageController {
  getAll(query: LanguageFilterDTO): Promise<MappedLanguage>;
  getById(params: LanguageRefDTO): Promise<LanguagePayload>;
  addLanguage(body: LanguageAddDTO): Promise<Language>;
  editLanguage(
    params: LanguageRefDTO,
    body: LanguageEditDTO,
  ): Promise<Language>;
  deleteLanguage(params: LanguageRefDTO): Promise<void>;
}

export interface ILanguageService {
  getAll(filter: ILanguageFilter): Promise<MappedLanguage>;
  getById(ref: LanguageRefDTO): Promise<LanguagePayload>;
  addLanguage(payload: ILanguage): Promise<Language>;
  editLanguage(
    ref: ILanguageRef,
    payload: Partial<ILanguage>,
  ): Promise<Language>;
  deleteLanguage(ref: ILanguageRef): Promise<void>;
}

export interface ILanguageRepository {
  findMany(filter: ILanguageFilter): Promise<WithPagination<Language>>;
  findOne(ref: ILanguageRef): Promise<Language | null>;
  create(payload: ILanguage): Promise<Language>;
  update(ref: ILanguageRef, payload: ILanguage): Promise<Language | null>;
  deleteOne(ref: ILanguageRef): Promise<DeleteResult>;
}

export interface ILanguageMapper {
  mapLanguage(language: Language): LanguagePayload;
  mapLanguages(payload: WithPagination<Language>): MappedLanguage;
}
