import { DeleteResult, Types } from 'mongoose';
import {
  IPaginationFilter,
  IQueryOptions,
  RequiredField,
  WithPagination,
} from '../..';
import {
  ProjectAddDTO,
  ProjectArchiveDTO,
  ProjectEditDTO,
  ProjectFilterDTO,
  ProjectRefDTO,
} from './projects.dtos';
import { MappedProject, Project, ProjectPayload } from './projects.types';

export interface IProject {
  name: string;
  active: boolean;
  description: string;
}

export interface IProjectRef {
  _id: Types.ObjectId;
}

export interface IProjectFilter extends IPaginationFilter {}

export interface IProjectController {
  getAll(query: ProjectFilterDTO): Promise<MappedProject>;
  getById(params: ProjectRefDTO): Promise<ProjectPayload>;
  addProject(body: ProjectAddDTO): Promise<Project>;
  editProject(params: ProjectRefDTO, body: ProjectEditDTO): Promise<Project>;
  archiveProject(
    params: ProjectRefDTO,
    body: ProjectArchiveDTO,
  ): Promise<Project>;
  deleteProject(params: ProjectRefDTO): Promise<void>;
}

export interface IProjectService {
  getAll(filter: IProjectFilter): Promise<MappedProject>;
  getById(ref: IProjectRef): Promise<ProjectPayload>;
  addProject(payload: IProject): Promise<Project>;
  editProject(ref: IProjectRef, payload: Partial<IProject>): Promise<Project>;
  archiveProject(
    ref: IProjectRef,
    payload: RequiredField<Partial<IProject>, 'active'>,
  ): Promise<Project>;
  deleteProject(ref: IProjectRef): Promise<void>;
}

export interface IProjectRepository {
  findOne(ref: IProjectRef): Promise<Project | null>;
  findMany(filter: IProjectFilter): Promise<WithPagination<Project>>;
  createOne(payload: IProject): Promise<Project>;
  updateOne(
    ref: IProjectRef,
    payload: IProject,
    options?: IQueryOptions,
  ): Promise<Project | null>;
  deleteOne(ref: IProjectRef, options?: IQueryOptions): Promise<DeleteResult>;
}

export interface IProjectMapper {
  mapProject(project: Project): ProjectPayload;
  mapProjects(payload: WithPagination<Project>): MappedProject;
}

export interface IProjectDeleteStrategy {
  softDelete(
    ref: IProjectRef,
    payload: RequiredField<Partial<IProject>, 'active'>,
  ): Promise<Project>;
  hardDelete(ref: IProjectRef): Promise<void>;
}
