import { DeleteResult, Types } from 'mongoose';
import { IPaginationFilter, WithPagination } from '../..';
import {
  ProjectAddDTO,
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
  deleteProject(params: ProjectRefDTO): Promise<void>;
}

export interface IProjectService {
  getAll(filter: IProjectFilter): Promise<MappedProject>;
  getById(ref: IProjectRef): Promise<ProjectPayload>;
  addProject(body: IProject): Promise<Project>;
  editProject(ref: IProjectRef, body: Partial<IProject>): Promise<Project>;
  deleteProject(ref: IProjectRef): Promise<void>;
}

export interface IProjectRepository {
  findOne(ref: IProjectRef): Promise<Project | null>;
  findMany(filter: IProjectFilter): Promise<WithPagination<Project>>;
  createOne(body: IProject): Promise<Project>;
  updateOne(ref: IProjectRef, body: IProject): Promise<Project | null>;
  deleteOne(ref: IProjectRef): Promise<DeleteResult>;
}

export interface IProjectMapper {
  mapProject(project: Project): ProjectPayload;
  mapProjects(payload: WithPagination<Project>): MappedProject;
}
