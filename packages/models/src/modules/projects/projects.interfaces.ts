import { DeleteResult } from 'mongoose';
import { AddProjectDTO, EditProjectDTO } from './projects.dtos';
import { MappedProject, Project, ProjectFilter } from './projects.types';

export interface IProject {
  name: string;
  description: string;
}

export interface IProjectRepository {
  findMany(): Promise<Project[]>;
  create(dto: AddProjectDTO): Promise<Project>;
  update(filter: ProjectFilter, dto: EditProjectDTO): Promise<Project | null>;
  deleteOne(filter: ProjectFilter): Promise<DeleteResult>;
}

export interface IProjectService {
  getAll(): Promise<MappedProject[]>;
  addProject(dto: AddProjectDTO): Promise<Project>;
  editProject(filter: ProjectFilter, dto: EditProjectDTO): Promise<Project>;
  deleteProject(filter: ProjectFilter): Promise<void>;
}

export interface IProjectController {
  getAll(): Promise<MappedProject[]>;
  addProject(dto: AddProjectDTO): Promise<Project>;
  editProject(_id: ProjectFilter['_id'], dto: EditProjectDTO): Promise<Project>;
  deleteProject(_id: ProjectFilter['_id']): Promise<void>;
}

export interface IProjectMapper {
  mapProjects(projects: Project[]): MappedProject[];
}
