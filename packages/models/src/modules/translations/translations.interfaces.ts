import { DeleteResult, Types, UpdateResult } from 'mongoose';
import {
  IPaginationFilter,
  IQueryOptions,
  TBody,
  TQuery,
  WithPagination,
} from '../../common';
import {
  TranslationAddDTO,
  TranslationEditDTO,
  TranslationFilterDTO,
  TranslationFilterPGDTO,
  TranslationRefDTO,
} from './translations.dtos';
import {
  FlatTranslation,
  MappedTranslation,
  Translation,
  TranslationTree,
  UFilterTranslation,
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

  getById(
    params: TranslationRefDTO,
    query: TranslationFilterDTO,
  ): Promise<MappedTranslation>;

  addTranslation(body: TranslationAddDTO): Promise<Translation>;

  editTranslation(
    params: TranslationRefDTO,
    query: TranslationFilterDTO,
    body: TranslationEditDTO,
  ): Promise<MappedTranslation>;

  deleteTranslation(
    params: TranslationRefDTO,
    query: TranslationFilterDTO,
  ): Promise<void>;
}

export interface ITranslationService {
  getAll({
    filter,
  }: TQuery<ITranslationFilterPG>): Promise<WithPagination<MappedTranslation>>;

  getById({ filter }: TQuery<UFilterTranslation>): Promise<MappedTranslation>;

  addTranslation({ payload }: TBody<ITranslation>): Promise<Translation>;

  editTranslation({
    filter,
    payload,
  }: TQuery<
    UFilterTranslation,
    Partial<ITranslation>
  >): Promise<MappedTranslation>;

  deleteTranslation({ filter }: TQuery<UFilterTranslation>): Promise<void>;
}

export interface ITranslationRepository {
  findOne({
    filter,
  }: TQuery<UFilterTranslation>): Promise<FlatTranslation | null>;

  findMany({
    filter,
  }: TQuery<ITranslationFilterPG>): Promise<WithPagination<FlatTranslation>>;

  createOne({ payload }: TBody<ITranslation>): Promise<Translation>;

  updateOne(
    { filter, payload }: TQuery<UFilterTranslation, Partial<ITranslation>>,
    options?: IQueryOptions,
  ): Promise<FlatTranslation | null>;

  updateMany(
    { filter, payload }: TQuery<ITranslationFilter, Partial<ITranslation>>,
    options?: IQueryOptions,
  ): Promise<UpdateResult>;

  deleteOne(
    { filter }: TQuery<UFilterTranslation>,
    options?: IQueryOptions,
  ): Promise<DeleteResult>;

  deleteMany(
    { filter }: TQuery<ITranslationFilter>,
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
