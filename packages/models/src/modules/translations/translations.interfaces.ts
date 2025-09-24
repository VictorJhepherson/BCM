import { DeleteResult, Types } from 'mongoose';
import { AddTranslationDTO, EditTranslationDTO } from './translations.dtos';
import {
  MappedTranslation,
  PopulateTranslation,
  Translation,
  TranslationFilter,
  TranslationTree,
} from './translations.types';

export interface ITranslation {
  projectId: Types.ObjectId;
  languageId: Types.ObjectId;
  translations: TranslationTree;
}

export interface ITranslationRepository {
  findMany(
    filter: Pick<TranslationFilter, 'projectId'>,
  ): Promise<PopulateTranslation[]>;
  findOne(filter: TranslationFilter): Promise<PopulateTranslation>;
  create(dto: AddTranslationDTO): Promise<Translation>;
  update(
    filter: TranslationFilter,
    dto: EditTranslationDTO,
  ): Promise<Translation | null>;
  deleteMany(
    filter: Pick<TranslationFilter, 'projectId'>,
  ): Promise<DeleteResult>;
  deleteOne(filter: TranslationFilter): Promise<DeleteResult>;
}

export interface ITranslationService {
  getByProject(
    filter: Pick<TranslationFilter, 'projectId'>,
  ): Promise<MappedTranslation[]>;
  getByLanguage(filter: TranslationFilter): Promise<MappedTranslation>;
  addTranslation(dto: AddTranslationDTO): Promise<Translation>;
  editTranslation(
    filter: TranslationFilter,
    dto: EditTranslationDTO,
  ): Promise<Translation>;
  deleteByProject(filter: Pick<TranslationFilter, 'projectId'>): Promise<void>;
  deleteByLanguage(filter: TranslationFilter): Promise<void>;
}

export interface ITranslationController {
  getByProject(
    projectId: TranslationFilter['projectId'],
  ): Promise<MappedTranslation[]>;
  getByLanguage(
    projectId: TranslationFilter['projectId'],
    languageId: TranslationFilter['languageId'],
  ): Promise<MappedTranslation>;
  addTranslation(dto: AddTranslationDTO): Promise<Translation>;
  editTranslation(
    projectId: TranslationFilter['projectId'],
    languageId: TranslationFilter['languageId'],
    dto: EditTranslationDTO,
  ): Promise<Translation>;
  deleteByProject(projectId: TranslationFilter['projectId']): Promise<void>;
  deleteByLanguage(
    projectId: TranslationFilter['projectId'],
    languageId: TranslationFilter['languageId'],
  ): Promise<void>;
}

export interface ITranslationMapper {
  mapTranslation(document: PopulateTranslation): MappedTranslation;
  mapTranslations(documents: PopulateTranslation[]): MappedTranslation[];
}
