import { Injectable } from '@nestjs/common';
import { BaseService } from '@shared/core';
import {
  AddProjectDTO,
  EditProjectDTO,
  IProjectService,
  MappedProject,
  Project,
  ProjectFilter,
} from '@shared/models';
import { ProjectMapper, ProjectMapperType } from '../mappers/projects.mapper';
import { ProjectRepository } from '../repositories/projects.repository';

@Injectable()
export class ProjectService
  extends BaseService<ProjectMapperType>
  implements IProjectService
{
  constructor(private readonly respository: ProjectRepository) {
    super('[projects]', new ProjectMapper());
  }

  async getAll(): Promise<MappedProject[]> {
    return this.execute(async () => {
      const data = await this.respository.getAll();

      return this.map({ key: 'mapProjects', data });
    });
  }

  async addProject(dto: AddProjectDTO): Promise<Project> {
    return this.execute(() => this.respository.addProject(dto));
  }

  async editProject(
    filter: ProjectFilter,
    dto: EditProjectDTO,
  ): Promise<Project> {
    return this.execute(() => this.respository.editProject(filter, dto));
  }

  async removeProject(filter: ProjectFilter): Promise<void> {
    return this.execute(() => this.respository.removeProject(filter));
  }
}
