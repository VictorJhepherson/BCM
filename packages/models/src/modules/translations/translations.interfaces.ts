import { Types } from 'mongoose';
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
  getByProject(
    filter: Pick<TranslationFilter, 'projectId'>,
  ): Promise<PopulateTranslation[]>;
  getByLanguage(filter: TranslationFilter): Promise<PopulateTranslation>;
  addTranslation(dto: AddTranslationDTO): Promise<Translation>;
  editTranslation(
    filter: TranslationFilter,
    dto: EditTranslationDTO,
  ): Promise<Translation>;
  removeByProject(filter: Pick<TranslationFilter, 'projectId'>): Promise<void>;
  removeByLanguage(filter: TranslationFilter): Promise<void>;
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
  removeByProject(filter: Pick<TranslationFilter, 'projectId'>): Promise<void>;
  removeByLanguage(filter: TranslationFilter): Promise<void>;
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
  removeByProject(projectId: TranslationFilter['projectId']): Promise<void>;
  removeByLanguage(
    projectId: TranslationFilter['projectId'],
    languageId: TranslationFilter['languageId'],
  ): Promise<void>;
}

export interface ITranslationMapper {
  mapTranslation(document: PopulateTranslation): MappedTranslation;
  mapTranslations(documents: PopulateTranslation[]): MappedTranslation[];
}
