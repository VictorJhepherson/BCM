import { ClientSession, DeleteResult, Types } from 'mongoose';
import { IPaginationFilter, RequiredField, WithPagination } from '../..';
import {
  LanguageAddDTO,
  LanguageArchiveDTO,
  LanguageEditDTO,
  LanguageFilterDTO,
  LanguageRefDTO,
} from './languages.dtos';
import {
  FlatLanguage,
  Language,
  LanguagePayload,
  MappedLanguage,
} from './languages.types';

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
  ): Promise<FlatLanguage>;
  archiveLanguage(
    params: LanguageRefDTO,
    body: LanguageArchiveDTO,
  ): Promise<FlatLanguage>;
  deleteLanguage(params: LanguageRefDTO): Promise<void>;
}

export interface ILanguageService {
  getAll(filter: ILanguageFilter): Promise<MappedLanguage>;
  getById(ref: ILanguageRef): Promise<LanguagePayload>;
  addLanguage(payload: ILanguage): Promise<Language>;
  editLanguage(
    ref: ILanguageRef,
    payload: Partial<ILanguage>,
  ): Promise<FlatLanguage>;
  archiveLanguage(
    ref: ILanguageRef,
    payload: RequiredField<Partial<ILanguage>, 'active'>,
  ): Promise<FlatLanguage>;
  deleteLanguage(ref: ILanguageRef): Promise<void>;
}

export interface ILanguageRepository {
  findOne(ref: ILanguageRef): Promise<FlatLanguage | null>;
  findMany(filter: ILanguageFilter): Promise<WithPagination<FlatLanguage>>;
  createOne(payload: ILanguage): Promise<Language>;
  updateOne(
    ref: ILanguageRef,
    payload: Partial<ILanguage>,
    session?: ClientSession,
  ): Promise<FlatLanguage | null>;
  deleteOne(ref: ILanguageRef, session?: ClientSession): Promise<DeleteResult>;
}

export interface ILanguageMapper {
  mapLanguage(language: FlatLanguage): LanguagePayload;
  mapLanguages(payload: WithPagination<FlatLanguage>): MappedLanguage;
}

export interface ILanguageDeleteStrategy {
  softDelete(
    ref: ILanguageRef,
    payload: RequiredField<Partial<ILanguage>, 'active'>,
  ): Promise<FlatLanguage>;
  hardDelete(ref: ILanguageRef): Promise<void>;
}
