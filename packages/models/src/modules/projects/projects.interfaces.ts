import { AddProjectDTO, EditProjectDTO } from './projects.dtos';
import { MappedProject, Project, ProjectFilter } from './projects.types';

export interface IProject {
  name: string;
  description: string;
}

export interface IProjectRepository {
  getAll(): Promise<Project[]>;
  addProject(dto: AddProjectDTO): Promise<Project>;
  editProject(filter: ProjectFilter, dto: EditProjectDTO): Promise<Project>;
  removeProject(filter: ProjectFilter): Promise<void>;
}

export interface IProjectService {
  getAll(): Promise<MappedProject[]>;
  addProject(dto: AddProjectDTO): Promise<Project>;
  editProject(filter: ProjectFilter, dto: EditProjectDTO): Promise<Project>;
  removeProject(filter: ProjectFilter): Promise<void>;
}

export interface IProjectController {
  getAll(): Promise<MappedProject[]>;
  addProject(dto: AddProjectDTO): Promise<Project>;
  editProject(id: ProjectFilter['id'], dto: EditProjectDTO): Promise<Project>;
  removeProject(id: ProjectFilter['id']): Promise<void>;
}

export interface IProjectMapper {
  mapProjects(documents: Project[]): MappedProject[];
}
