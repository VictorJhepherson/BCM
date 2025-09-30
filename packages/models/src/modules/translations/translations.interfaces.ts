import { ClientSession, DeleteResult, Types, UpdateResult } from 'mongoose';
import { IPaginationFilter, WithPagination } from '../..';
import {
  TranslationAddDTO,
  TranslationEditDTO,
  TranslationFilterDTO,
  TranslationRefDTO,
} from './translations.dtos';
import {
  FlatTranslation,
  MappedTranslation,
  PopulateTranslation,
  Translation,
  TranslationPayload,
  TranslationTree,
} from './translations.types';

export interface ITranslation {
  active: boolean;
  project: Types.ObjectId;
  language: Types.ObjectId;
  translations: TranslationTree;
}

export interface ITranslationRef {
  project: Types.ObjectId;
  language: Types.ObjectId;
}

export interface ITranslationFilter extends IPaginationFilter {}

export interface ITranslationController {
  getAll(query: TranslationFilterDTO): Promise<MappedTranslation>;
  getById(params: TranslationRefDTO): Promise<TranslationPayload>;
  addTranslation(body: TranslationAddDTO): Promise<Translation>;
  editTranslation(
    params: TranslationRefDTO,
    body: TranslationEditDTO,
  ): Promise<FlatTranslation>;
  deleteTranslation(params: TranslationRefDTO): Promise<void>;
}

export interface ITranslationService {
  getAll(filter: ITranslationFilter): Promise<MappedTranslation>;
  getById(ref: ITranslationRef): Promise<TranslationPayload>;
  addTranslation(payload: ITranslation): Promise<Translation>;
  editTranslation(
    ref: ITranslationRef,
    payload: Partial<ITranslation>,
  ): Promise<FlatTranslation>;
  deleteTranslation(ref: ITranslationRef): Promise<void>;
}

export interface ITranslationRepository {
  findOne(ref: ITranslationRef): Promise<PopulateTranslation | null>;
  findMany(
    filter: ITranslationFilter,
  ): Promise<WithPagination<PopulateTranslation>>;
  createOne(payload: ITranslation): Promise<Translation>;
  updateOne(
    ref: ITranslationRef,
    payload: Partial<ITranslation>,
  ): Promise<FlatTranslation | null>;
  updateMany(
    ref: Partial<ITranslationRef>,
    payload: Partial<ITranslation>,
    session?: ClientSession,
  ): Promise<UpdateResult>;
  deleteOne(
    ref: ITranslationRef,
    session?: ClientSession,
  ): Promise<DeleteResult>;
  deleteMany(
    ref: Partial<ITranslationRef>,
    session?: ClientSession,
  ): Promise<DeleteResult>;
}

export interface ITranslationMapper {
  mapTranslation(translation: PopulateTranslation): TranslationPayload;
  mapTranslations(
    payload: WithPagination<PopulateTranslation>,
  ): MappedTranslation;
}
