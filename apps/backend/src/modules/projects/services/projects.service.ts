import { ProjectMapper } from '@/modules/projects/mappers/projects.mapper';
import { IProjectService } from '@/modules/projects/models';
import { ProjectRepository } from '@/modules/projects/repositories/projects.repository';
import { ProjectDeleteStrategy } from '@/modules/projects/strategies';
import { BaseService } from '@/shared/core';
import { format } from '@/shared/helpers';
import { LoggerProvider } from '@/shared/providers';

import {
  IProjectEntity,
  IProjectFilter,
  IUProjectFilter,
  TBody,
  TMappedProject,
  TProject,
  TQuery,
  TWithPagination,
} from '@bcm/models';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class ProjectService extends BaseService implements IProjectService {
  constructor(
    logger: LoggerProvider,
    private readonly mapper: ProjectMapper,
    @InjectConnection()
    private readonly connection: Connection,
    private readonly repository: ProjectRepository,
    private readonly deleteStrategy: ProjectDeleteStrategy,
  ) {
    super('[projects]', logger);
  }

  async getAll({
    filter,
  }: TQuery<IProjectFilter>): Promise<TWithPagination<TMappedProject>> {
    return this.run({
      fn: (builder) =>
        builder
          .use(() => this.repository.findMany({ filter }))
          .useMapper(this.mapper)
          .map({ key: 'mapProjects' })
          .execute(),
    });
  }

  async getById({ filter }: TQuery<IUProjectFilter>): Promise<TMappedProject> {
    return this.run({
      fn: (builder) => {
        const promise = async () => {
          const finded = await this.repository.findOne({ filter });

          if (!finded) {
            throw new NotFoundException({
              message: `Unable to find a project for: ${format.base(filter)}`,
            });
          }

          return finded;
        };

        return builder
          .use(promise)
          .useMapper(this.mapper)
          .map({ key: 'mapProject' })
          .execute();
      },
    });
  }

  async addProject({ payload }: TBody<IProjectEntity>): Promise<TProject> {
    return this.run({
      fn: () => this.repository.createOne({ payload }),
    });
  }

  async editProject({
    filter,
    payload,
  }: TQuery<
    IUProjectFilter,
    Partial<IProjectEntity>
  >): Promise<TMappedProject> {
    return this.run({
      fn: (builder) => {
        const promise = async () => {
          const updated = await this.repository.updateOne({ filter, payload });

          if (!updated) {
            throw new NotFoundException({
              message: `Unable to find a project for: ${format.base(filter)}`,
            });
          }

          return updated;
        };

        return builder
          .use(promise)
          .useMapper(this.mapper)
          .map({ key: 'mapProject' })
          .execute();
      },
    });
  }

  async archiveProject({
    filter,
    payload,
  }: TQuery<
    IUProjectFilter,
    Pick<IProjectEntity, 'active'>
  >): Promise<TMappedProject> {
    return this.run({
      fn: (builder) =>
        builder
          .use((session) =>
            this.deleteStrategy.softDelete({ filter, payload }, { session }),
          )
          .useConnection(this.connection)
          .useMapper(this.mapper)
          .map({ key: 'mapProject' })
          .execute(),
    });
  }

  async deleteProject({ filter }: TQuery<IUProjectFilter>): Promise<void> {
    return this.run({
      fn: (builder) =>
        builder
          .use((session) =>
            this.deleteStrategy.hardDelete({ filter }, { session }),
          )
          .useConnection(this.connection)
          .execute(),
    });
  }
}
