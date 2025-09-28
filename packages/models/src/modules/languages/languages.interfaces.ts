import { DeleteResult, Types } from 'mongoose';
import {
  IPaginationFilter,
  IQueryOptions,
  RequiredField,
  WithPagination,
} from '../..';
import {
  LanguageAddDTO,
  LanguageArchiveDTO,
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
  archiveLanguage(
    params: LanguageRefDTO,
    body: LanguageArchiveDTO,
  ): Promise<Language>;
  deleteLanguage(params: LanguageRefDTO): Promise<void>;
}

export interface ILanguageService {
  getAll(filter: ILanguageFilter): Promise<MappedLanguage>;
  getById(ref: ILanguageRef): Promise<LanguagePayload>;
  addLanguage(payload: ILanguage): Promise<Language>;
  editLanguage(
    ref: ILanguageRef,
    payload: Partial<ILanguage>,
  ): Promise<Language>;
  archiveLanguage(
    ref: ILanguageRef,
    payload: RequiredField<Partial<ILanguage>, 'active'>,
  ): Promise<Language>;
  deleteLanguage(ref: ILanguageRef): Promise<void>;
}

export interface ILanguageRepository {
  findOne(ref: ILanguageRef): Promise<Language | null>;
  findMany(filter: ILanguageFilter): Promise<WithPagination<Language>>;
  createOne(payload: ILanguage): Promise<Language>;
  updateOne(
    ref: ILanguageRef,
    payload: Partial<ILanguage>,
    options?: IQueryOptions,
  ): Promise<Language | null>;
  deleteOne(ref: ILanguageRef, options?: IQueryOptions): Promise<DeleteResult>;
}

export interface ILanguageMapper {
  mapLanguage(language: Language): LanguagePayload;
  mapLanguages(payload: WithPagination<Language>): MappedLanguage;
}

export interface ILanguageDeleteStrategy {
  softDelete(
    ref: ILanguageRef,
    payload: RequiredField<Partial<ILanguage>, 'active'>,
  ): Promise<Language>;
  hardDelete(ref: ILanguageRef): Promise<void>;
}
