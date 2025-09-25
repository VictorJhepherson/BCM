import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '@shared/core';
import { format } from '@shared/helpers';
import {
  IProject,
  IProjectFilter,
  IProjectRef,
  IProjectService,
  MappedProject,
  Project,
  ProjectPayload,
} from '@shared/models';
import { LoggerProvider } from '../../../providers';
import { ProjectMapper, ProjectMapperType } from '../mappers/projects.mapper';
import { ProjectRepository } from '../repositories/projects.repository';

@Injectable()
export class ProjectService
  extends BaseService<ProjectMapperType>
  implements IProjectService
{
  constructor(
    logger: LoggerProvider,
    private readonly repository: ProjectRepository,
  ) {
    super('[projects]', logger, new ProjectMapper());
  }

  async getAll(filter: IProjectFilter): Promise<MappedProject> {
    return this.execute({
      mapKey: 'mapProjects',
      fn: () => this.repository.findMany(filter),
    });
  }

  async getById(ref: IProjectRef): Promise<ProjectPayload> {
    return this.execute({
      mapKey: 'mapProject',
      fn: async () => {
        const finded = await this.repository.findOne(ref);

        if (!finded) {
          throw new NotFoundException({
            message: `Unable to find a project for: ${format.base(ref)}`,
          });
        }

        return finded;
      },
    });
  }

  async addProject(payload: IProject): Promise<Project> {
    return this.execute({
      fn: () => this.repository.create(payload),
    });
  }

  async editProject(
    ref: IProjectRef,
    payload: Partial<IProject>,
  ): Promise<Project> {
    return this.execute({
      fn: async () => {
        const updated = await this.repository.update(ref, payload);

        if (!updated) {
          throw new NotFoundException({
            message: `Unable to find a project for: ${format.base(ref)}`,
          });
        }

        return updated;
      },
    });
  }

  async deleteProject(ref: IProjectRef): Promise<void> {
    return this.execute({
      fn: async () => {
        const deleted = await this.repository.deleteOne(ref);

        if (deleted.deletedCount < 1) {
          throw new NotFoundException({
            message: `Failed to delete a project for: ${format.base(ref)}`,
          });
        }
      },
    });
  }
}
