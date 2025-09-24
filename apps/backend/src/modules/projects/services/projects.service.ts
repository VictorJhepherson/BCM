import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '@shared/core';
import { format } from '@shared/helpers';
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
      const data = await this.respository.findMany();

      return this.map({ key: 'mapProjects', data });
    });
  }

  async addProject(dto: AddProjectDTO): Promise<Project> {
    return this.execute(() => this.respository.create(dto));
  }

  async editProject(
    filter: ProjectFilter,
    dto: EditProjectDTO,
  ): Promise<Project> {
    return this.execute(async () => {
      const updated = await this.respository.update(filter, dto);

      if (!updated) {
        throw new NotFoundException({
          message: `Unable to find a project for: ${format.base(filter)}`,
        });
      }

      return updated;
    });
  }

  async deleteProject(filter: ProjectFilter): Promise<void> {
    return this.execute(async () => {
      const deleted = await this.respository.deleteOne(filter);

      if (deleted.deletedCount < 1) {
        throw new NotFoundException({
          message: `Failed to delete a project for: ${format.base(filter)}`,
        });
      }
    });
  }
}
