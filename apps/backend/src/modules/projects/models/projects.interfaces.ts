import {
  ProjectAddDTO,
  ProjectArchiveDTO,
  ProjectEditDTO,
  ProjectFilterDTO,
  UProjectFilterDTO,
} from '@/modules/projects/models/projects.dtos';
import {
  TFlatProject,
  TMappedProject,
  TProject,
} from '@/modules/projects/models/projects.types';
import { IQueryOptions } from '@/shared/models';

import {
  IProjectEntity,
  IProjectFilter,
  IUProjectFilter,
  TBody,
  TQuery,
  TWithPagination,
} from '@bcm/models';

import { DeleteResult } from 'mongoose';

export interface IProjectController {
  getAll(filter: ProjectFilterDTO): Promise<TWithPagination<TMappedProject>>;

  getById(filter: UProjectFilterDTO): Promise<TMappedProject>;

  addProject(payload: ProjectAddDTO): Promise<TProject>;

  editProject(
    filter: UProjectFilterDTO,
    payload: ProjectEditDTO,
  ): Promise<TMappedProject>;

  archiveProject(
    filter: UProjectFilterDTO,
    payload: ProjectArchiveDTO,
  ): Promise<TMappedProject>;

  deleteProject(filter: UProjectFilterDTO): Promise<void>;
}

export interface IProjectService {
  getAll({
    filter,
  }: TQuery<IProjectFilter>): Promise<TWithPagination<TMappedProject>>;

  getById({ filter }: TQuery<IUProjectFilter>): Promise<TMappedProject>;

  addProject({ payload }: TBody<IProjectEntity>): Promise<TProject>;

  editProject({
    filter,
    payload,
  }: TQuery<IUProjectFilter, Partial<IProjectEntity>>): Promise<TMappedProject>;

  archiveProject({
    filter,
    payload,
  }: TQuery<
    IUProjectFilter,
    Pick<IProjectEntity, 'active'>
  >): Promise<TMappedProject>;

  deleteProject({ filter }: TQuery<IUProjectFilter>): Promise<void>;
}

//#region PATTERNS
export interface IProjectRepository {
  findOne(
    { filter }: TQuery<IUProjectFilter>,
    options?: IQueryOptions,
  ): Promise<TFlatProject | null>;

  findMany(
    { filter }: TQuery<IProjectFilter>,
    options?: IQueryOptions,
  ): Promise<TWithPagination<TFlatProject>>;

  createOne(
    { payload }: TBody<IProjectEntity>,
    options?: IQueryOptions,
  ): Promise<TProject>;

  updateOne(
    { filter, payload }: TQuery<IUProjectFilter, Partial<IProjectEntity>>,
    options?: IQueryOptions,
  ): Promise<TFlatProject | null>;

  deleteOne(
    { filter }: TQuery<IUProjectFilter>,
    options?: IQueryOptions,
  ): Promise<DeleteResult>;
}

export interface IProjectDeleteStrategy {
  softDelete(
    {
      filter,
      payload,
    }: TQuery<IUProjectFilter, Pick<IProjectEntity, 'active'>>,
    options?: IQueryOptions,
  ): Promise<TFlatProject>;

  hardDelete(
    { filter }: TQuery<IUProjectFilter>,
    options?: IQueryOptions,
  ): Promise<void>;
}

export interface IProjectFacade {}
//#endregion PATTERNS

//#region MAPPERS
export interface IProjectMapper {
  mapProject(project: TFlatProject): TMappedProject;

  mapProjects(
    payload: TWithPagination<TFlatProject>,
  ): TWithPagination<TMappedProject>;
}
//#endregion MAPPERS
