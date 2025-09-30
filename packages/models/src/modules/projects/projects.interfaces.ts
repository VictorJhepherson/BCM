import { ClientSession, DeleteResult, Types } from 'mongoose';
import { IPaginationFilter, RequiredField, WithPagination } from '../..';
import {
  ProjectAddDTO,
  ProjectArchiveDTO,
  ProjectEditDTO,
  ProjectFilterDTO,
  ProjectRefDTO,
} from './projects.dtos';
import {
  FlatProject,
  MappedProject,
  Project,
  ProjectPayload,
} from './projects.types';

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
  editProject(
    params: ProjectRefDTO,
    body: ProjectEditDTO,
  ): Promise<FlatProject>;
  archiveProject(
    params: ProjectRefDTO,
    body: ProjectArchiveDTO,
  ): Promise<FlatProject>;
  deleteProject(params: ProjectRefDTO): Promise<void>;
}

export interface IProjectService {
  getAll(filter: IProjectFilter): Promise<MappedProject>;
  getById(ref: IProjectRef): Promise<ProjectPayload>;
  addProject(payload: IProject): Promise<Project>;
  editProject(
    ref: IProjectRef,
    payload: Partial<IProject>,
  ): Promise<FlatProject>;
  archiveProject(
    ref: IProjectRef,
    payload: RequiredField<Partial<IProject>, 'active'>,
  ): Promise<FlatProject>;
  deleteProject(ref: IProjectRef): Promise<void>;
}

export interface IProjectRepository {
  findOne(ref: IProjectRef): Promise<FlatProject | null>;
  findMany(filter: IProjectFilter): Promise<WithPagination<FlatProject>>;
  createOne(payload: IProject): Promise<Project>;
  updateOne(
    ref: IProjectRef,
    payload: IProject,
    session?: ClientSession,
  ): Promise<FlatProject | null>;
  deleteOne(ref: IProjectRef, session?: ClientSession): Promise<DeleteResult>;
}

export interface IProjectMapper {
  mapProject(project: FlatProject): ProjectPayload;
  mapProjects(payload: WithPagination<FlatProject>): MappedProject;
}

export interface IProjectDeleteStrategy {
  softDelete(
    ref: IProjectRef,
    payload: RequiredField<Partial<IProject>, 'active'>,
  ): Promise<FlatProject>;
  hardDelete(ref: IProjectRef): Promise<void>;
}
