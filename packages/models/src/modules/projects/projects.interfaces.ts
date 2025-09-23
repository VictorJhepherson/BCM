import { AddProjectDTO, EditProjectDTO } from './projects.dtos';
import { MappedProject, Project, ProjectFilter } from './projects.types';

export interface IProject {
  name: string;
  description: string;
}

export interface IProjectRepository {
  find(): Promise<Project[]>;
  create(dto: AddProjectDTO): Promise<Project>;
  update(filter: ProjectFilter, dto: EditProjectDTO): Promise<Project | null>;
  delete(filter: ProjectFilter): Promise<Project | null>;
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
  editProject(id: ProjectFilter['id'], dto: EditProjectDTO): Promise<Project>;
  deleteProject(id: ProjectFilter['id']): Promise<void>;
}

export interface IProjectMapper {
  mapProjects(projects: Project[]): MappedProject[];
}
