import {
  TranslationAddDTO,
  TranslationArchiveDTO,
  TranslationEditDTO,
  TranslationFilterDTO,
  UTranslationFilterDTO,
} from '@/modules/translations/models';
import { IQueryOptions } from '@/shared/models';

import {
  ITranslationEntity,
  ITranslationFilter,
  IUTranslationFilter,
  TBody,
  TFlatTranslation,
  TMappedTranslation,
  TQuery,
  TTranslation,
  TWithPagination,
} from '@bcm/models';

import { DeleteResult, UpdateResult } from 'mongoose';

export interface ITranslationController {
  getAll(
    filter: TranslationFilterDTO,
  ): Promise<TWithPagination<TMappedTranslation>>;

  getById(filter: UTranslationFilterDTO): Promise<TMappedTranslation>;

  addTranslation(payload: TranslationAddDTO): Promise<TTranslation>;

  editTranslation(
    filter: UTranslationFilterDTO,
    payload: TranslationEditDTO,
  ): Promise<TMappedTranslation>;

  archiveTranslation(
    filter: UTranslationFilterDTO,
    payload: TranslationArchiveDTO,
  ): Promise<TMappedTranslation>;

  deleteTranslation(filter: UTranslationFilterDTO): Promise<void>;
}

export interface ITranslationService {
  getAll({
    filter,
  }: TQuery<ITranslationFilter>): Promise<TWithPagination<TMappedTranslation>>;

  getById({ filter }: TQuery<IUTranslationFilter>): Promise<TMappedTranslation>;

  addTranslation({ payload }: TBody<ITranslationEntity>): Promise<TTranslation>;

  editTranslation({
    filter,
    payload,
  }: TQuery<
    IUTranslationFilter,
    Partial<ITranslationEntity>
  >): Promise<TMappedTranslation>;

  archiveTranslation({
    filter,
    payload,
  }: TQuery<
    IUTranslationFilter,
    Pick<ITranslationEntity, 'active'>
  >): Promise<TMappedTranslation>;

  deleteTranslation({ filter }: TQuery<IUTranslationFilter>): Promise<void>;
}

//#region PATTERNS
export interface ITranslationRepository {
  findOne(
    { filter }: TQuery<IUTranslationFilter>,
    options?: IQueryOptions,
  ): Promise<TFlatTranslation | null>;

  findMany(
    { filter }: TQuery<ITranslationFilter>,
    options?: IQueryOptions,
  ): Promise<TWithPagination<TFlatTranslation>>;

  createOne(
    { payload }: TBody<ITranslationEntity>,
    options?: IQueryOptions,
  ): Promise<TTranslation>;

  updateOne(
    {
      filter,
      payload,
    }: TQuery<IUTranslationFilter, Partial<ITranslationEntity>>,
    options?: IQueryOptions,
  ): Promise<TFlatTranslation | null>;

  updateMany(
    {
      filter,
      payload,
    }: TQuery<ITranslationFilter, Partial<ITranslationEntity>>,
    options?: IQueryOptions,
  ): Promise<UpdateResult>;

  deleteOne(
    { filter }: TQuery<IUTranslationFilter>,
    options?: IQueryOptions,
  ): Promise<DeleteResult>;

  deleteMany(
    { filter }: TQuery<ITranslationFilter>,
    options?: IQueryOptions,
  ): Promise<DeleteResult>;
}

export interface ITranslationStrategy {}

export interface ITranslationFacade {}
//#endregion PATTERNS

//#region MAPPERS
export interface ITranslationMapper {
  mapTranslation(translation: TFlatTranslation): TMappedTranslation;

  mapTranslations(
    payload: TWithPagination<TFlatTranslation>,
  ): TWithPagination<TMappedTranslation>;
}
//#endregion MAPPERS
