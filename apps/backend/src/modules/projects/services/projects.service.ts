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
    private readonly respository: ProjectRepository,
  ) {
    super('[projects]', logger, new ProjectMapper());
  }

  async getAll(filter: IProjectFilter): Promise<MappedProject> {
    return this.execute({
      mapKey: 'mapProjects',
      fn: () => this.respository.findMany(filter),
    });
  }

  async addProject(payload: IProject): Promise<Project> {
    return this.execute({
      fn: () => this.respository.create(payload),
    });
  }

  async editProject(
    ref: IProjectRef,
    payload: Partial<IProject>,
  ): Promise<Project> {
    return this.execute({
      fn: async () => {
        const updated = await this.respository.update(ref, payload);

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
        const deleted = await this.respository.deleteOne(ref);

        if (deleted.deletedCount < 1) {
          throw new NotFoundException({
            message: `Failed to delete a project for: ${format.base(ref)}`,
          });
        }
      },
    });
  }
}
