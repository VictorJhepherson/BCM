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
import { FlatLanguage, Language, MappedLanguage } from './languages.types';

export interface ILanguage {
  name: string;
  active: boolean;
}

export interface ILanguageRef {
  _id: Types.ObjectId;
}

export interface ILanguageFilter extends IPaginationFilter {}

export interface ILanguageController {
  getAll(query: LanguageFilterDTO): Promise<WithPagination<MappedLanguage>>;
  getById(params: LanguageRefDTO): Promise<MappedLanguage>;
  addLanguage(body: LanguageAddDTO): Promise<Language>;
  editLanguage(
    params: LanguageRefDTO,
    body: LanguageEditDTO,
  ): Promise<MappedLanguage>;
  archiveLanguage(
    params: LanguageRefDTO,
    body: LanguageArchiveDTO,
  ): Promise<MappedLanguage>;
  deleteLanguage(params: LanguageRefDTO): Promise<void>;
}

export interface ILanguageService {
  getAll(filter: ILanguageFilter): Promise<WithPagination<MappedLanguage>>;
  getById(ref: ILanguageRef): Promise<MappedLanguage>;
  addLanguage(payload: ILanguage): Promise<Language>;
  editLanguage(
    ref: ILanguageRef,
    payload: Partial<ILanguage>,
  ): Promise<MappedLanguage>;
  archiveLanguage(
    ref: ILanguageRef,
    payload: RequiredField<Partial<ILanguage>, 'active'>,
  ): Promise<MappedLanguage>;
  deleteLanguage(ref: ILanguageRef): Promise<void>;
}

export interface ILanguageRepository {
  findOne(ref: ILanguageRef): Promise<FlatLanguage | null>;
  findMany(filter: ILanguageFilter): Promise<WithPagination<FlatLanguage>>;
  createOne(payload: ILanguage): Promise<Language>;
  updateOne(
    ref: ILanguageRef,
    payload: Partial<ILanguage>,
    options?: IQueryOptions,
  ): Promise<FlatLanguage | null>;
  deleteOne(ref: ILanguageRef, options?: IQueryOptions): Promise<DeleteResult>;
}

export interface ILanguageMapper {
  mapLanguage(language: FlatLanguage): MappedLanguage;
  mapLanguages(
    payload: WithPagination<FlatLanguage>,
  ): WithPagination<MappedLanguage>;
}

export interface ILanguageDeleteStrategy {
  softDelete(
    ref: ILanguageRef,
    payload: RequiredField<Partial<ILanguage>, 'active'>,
    options?: IQueryOptions,
  ): Promise<FlatLanguage>;
  hardDelete(ref: ILanguageRef, options?: IQueryOptions): Promise<void>;
}
