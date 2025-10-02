import { DeleteResult, Types } from 'mongoose';
import {
  IPaginationFilter,
  IQueryOptions,
  RequiredField,
  WithPagination,
} from '../../common';
import {
  ProjectAddDTO,
  ProjectArchiveDTO,
  ProjectEditDTO,
  ProjectFilterPGDTO,
  ProjectRefDTO,
} from './projects.dtos';
import { FlatProject, MappedProject, Project } from './projects.types';

//#region REQUESTERS
export interface IProject {
  name: string;
  active: boolean;
  languages: string[];
  description: string;
}

export interface IProjectRef {
  _id: Types.ObjectId;
}

export interface IProjectFilter {
  active?: boolean;
}

export interface IProjectFilterPG extends IProjectFilter, IPaginationFilter {}
//#endregion REQUESTERS

//#region LAYERS
export interface IProjectController {
  getAll(query: ProjectFilterPGDTO): Promise<WithPagination<MappedProject>>;

  getById(params: ProjectRefDTO): Promise<MappedProject>;

  addProject(body: ProjectAddDTO): Promise<Project>;

  editProject(
    params: ProjectRefDTO,
    body: ProjectEditDTO,
  ): Promise<MappedProject>;

  archiveProject(
    params: ProjectRefDTO,
    body: ProjectArchiveDTO,
  ): Promise<MappedProject>;

  deleteProject(params: ProjectRefDTO): Promise<void>;
}

export interface IProjectService {
  getAll(filter: IProjectFilterPG): Promise<WithPagination<MappedProject>>;

  getById(ref: IProjectRef): Promise<MappedProject>;

  addProject(payload: IProject): Promise<Project>;

  editProject(
    ref: IProjectRef,
    payload: Partial<IProject>,
  ): Promise<MappedProject>;

  archiveProject(
    ref: IProjectRef,
    payload: RequiredField<Partial<IProject>, 'active'>,
  ): Promise<MappedProject>;

  deleteProject(ref: IProjectRef): Promise<void>;
}

export interface IProjectDeleteStrategy {
  softDelete(
    ref: IProjectRef,
    payload: RequiredField<Partial<IProject>, 'active'>,
    options?: IQueryOptions,
  ): Promise<FlatProject>;

  hardDelete(ref: IProjectRef, options?: IQueryOptions): Promise<void>;
}

export interface IProjectRepository {
  findOne(ref: IProjectRef): Promise<FlatProject | null>;

  findMany(filter: IProjectFilterPG): Promise<WithPagination<FlatProject>>;

  createOne(payload: IProject): Promise<Project>;

  updateOne(
    ref: IProjectRef,
    payload: IProject,
    options?: IQueryOptions,
  ): Promise<FlatProject | null>;

  deleteOne(ref: IProjectRef, options?: IQueryOptions): Promise<DeleteResult>;
}
//#endregion LAYERS

//#region MAPPERS
export interface IProjectMapper {
  mapProject(project: FlatProject): MappedProject;

  mapProjects(
    payload: WithPagination<FlatProject>,
  ): WithPagination<MappedProject>;
}
//#endregion MAPPERS
