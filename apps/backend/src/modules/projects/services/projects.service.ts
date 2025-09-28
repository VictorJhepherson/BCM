import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '@shared/core';
import { format } from '@shared/helpers';
import {
  FlatProject,
  IProject,
  IProjectFilter,
  IProjectRef,
  IProjectService,
  MappedProject,
  Project,
  ProjectPayload,
  RequiredField,
} from '@shared/models';
import { LoggerProvider } from '../../../providers';
import { ProjectMapper, ProjectMapperType } from '../mappers/projects.mapper';
import { ProjectRepository } from '../repositories/projects.repository';
import { ProjectDeleteStrategy } from '../strategies';

@Injectable()
export class ProjectService
  extends BaseService<ProjectMapperType>
  implements IProjectService
{
  constructor(
    logger: LoggerProvider,
    private readonly repository: ProjectRepository,
    private readonly deleteStrategy: ProjectDeleteStrategy,
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
      fn: () => this.repository.createOne(payload),
    });
  }

  async editProject(
    ref: IProjectRef,
    payload: Partial<IProject>,
  ): Promise<FlatProject> {
    return this.execute({
      fn: async () => {
        const updated = await this.repository.updateOne(ref, payload);

        if (!updated) {
          throw new NotFoundException({
            message: `Unable to find a project for: ${format.base(ref)}`,
          });
        }

        return updated;
      },
    });
  }

  async archiveProject(
    ref: IProjectRef,
    payload: RequiredField<Partial<IProject>, 'active'>,
  ): Promise<FlatProject> {
    return this.execute({
      fn: () => this.deleteStrategy.softDelete(ref, payload),
    });
  }

  async deleteProject(ref: IProjectRef): Promise<void> {
    return this.execute({
      fn: () => this.deleteStrategy.hardDelete(ref),
    });
  }
}
