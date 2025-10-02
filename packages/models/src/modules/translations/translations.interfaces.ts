import { DeleteResult, Types, UpdateResult } from 'mongoose';
import { IPaginationFilter, IQueryOptions, WithPagination } from '../../common';
import {
  TranslationAddDTO,
  TranslationEditDTO,
  TranslationFilterPGDTO,
  TranslationRefDTO,
} from './translations.dtos';
import {
  FlatTranslation,
  MappedTranslation,
  Translation,
  TranslationTree,
} from './translations.types';

//#region REQUESTERS
export interface ITranslation {
  active: boolean;
  language: string;
  project: Types.ObjectId;
  translations: TranslationTree;
}

export interface ITranslationRef {
  _id: Types.ObjectId;
}

export interface ITranslationFilter {
  active?: boolean;
  project?: Types.ObjectId;
}

export interface ITranslationFilterPG
  extends ITranslationFilter,
    IPaginationFilter {}
//#endregion REQUESTERS

//#region LAYERS
export interface ITranslationController {
  getAll(
    query: TranslationFilterPGDTO,
  ): Promise<WithPagination<MappedTranslation>>;

  getById(params: TranslationRefDTO): Promise<MappedTranslation>;

  addTranslation(body: TranslationAddDTO): Promise<Translation>;

  editTranslation(
    params: TranslationRefDTO,
    body: TranslationEditDTO,
  ): Promise<MappedTranslation>;

  deleteTranslation(params: TranslationRefDTO): Promise<void>;
}

export interface ITranslationService {
  getAll(
    filter: ITranslationFilterPG,
  ): Promise<WithPagination<MappedTranslation>>;

  getById(ref: ITranslationRef): Promise<MappedTranslation>;

  addTranslation(payload: ITranslation): Promise<Translation>;

  editTranslation(
    ref: ITranslationRef,
    payload: Partial<ITranslation>,
  ): Promise<MappedTranslation>;

  deleteTranslation(ref: ITranslationRef): Promise<void>;
}

export interface ITranslationRepository {
  findOne(ref: ITranslationRef): Promise<FlatTranslation | null>;

  findMany(
    filter: ITranslationFilterPG,
  ): Promise<WithPagination<FlatTranslation>>;

  createOne(payload: ITranslation): Promise<Translation>;

  updateOne(
    ref: ITranslationRef,
    payload: Partial<ITranslation>,
    options?: IQueryOptions,
  ): Promise<FlatTranslation | null>;

  updateMany(
    ref: Partial<ITranslationRef>,
    payload: Partial<ITranslation>,
    options?: IQueryOptions,
  ): Promise<UpdateResult>;

  deleteOne(
    ref: ITranslationRef,
    options?: IQueryOptions,
  ): Promise<DeleteResult>;

  deleteMany(
    ref: Partial<ITranslationRef>,
    options?: IQueryOptions,
  ): Promise<DeleteResult>;
}
//#endregion LAYERS

//#region MAPPERS
export interface ITranslationMapper {
  mapTranslation(translation: FlatTranslation): MappedTranslation;

  mapTranslations(
    payload: WithPagination<FlatTranslation>,
  ): WithPagination<MappedTranslation>;
}
//#endregion MAPPERS
