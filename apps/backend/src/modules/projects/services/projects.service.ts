import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { BaseService } from '@shared/core';
import { format } from '@shared/helpers';
import {
  IProject,
  IProjectFilter,
  IProjectRef,
  IProjectService,
  MappedProject,
  Project,
  RequiredField,
  WithPagination,
} from '@shared/models';
import { Connection } from 'mongoose';
import { LoggerProvider } from '../../../providers';
import { ProjectMapper } from '../mappers/projects.mapper';
import { ProjectRepository } from '../repositories/projects.repository';
import { ProjectDeleteStrategy } from '../strategies';

@Injectable()
export class ProjectService extends BaseService implements IProjectService {
  private readonly mapper: ProjectMapper;

  constructor(
    logger: LoggerProvider,
    @InjectConnection()
    private readonly connection: Connection,
    private readonly repository: ProjectRepository,
    private readonly deleteStrategy: ProjectDeleteStrategy,
  ) {
    super('[projects]', logger);

    this.mapper = new ProjectMapper();
  }

  async getAll(filter: IProjectFilter): Promise<WithPagination<MappedProject>> {
    return this.execute({
      fn: (builder) =>
        builder
          .use(() => this.repository.findMany(filter))
          .withMapper(this.mapper)
          .map({ key: 'mapProjects' })
          .build(),
    });
  }

  async getById(ref: IProjectRef): Promise<MappedProject> {
    return this.execute({
      fn: (builder) => {
        const promise = async () => {
          const finded = await this.repository.findOne(ref);

          if (!finded) {
            throw new NotFoundException({
              message: `Unable to find a project for: ${format.base(ref)}`,
            });
          }

          return finded;
        };

        return builder
          .use(promise)
          .withMapper(this.mapper)
          .map({ key: 'mapProject' })
          .build();
      },
    });
  }

  async addProject(payload: IProject): Promise<Project> {
    return this.execute({
      fn: (builder) =>
        builder.use(() => this.repository.createOne(payload)).build(),
    });
  }

  async editProject(
    ref: IProjectRef,
    payload: Partial<IProject>,
  ): Promise<MappedProject> {
    return this.execute({
      fn: (builder) => {
        const promise = async () => {
          const updated = await this.repository.updateOne(ref, payload);

          if (!updated) {
            throw new NotFoundException({
              message: `Unable to find a project for: ${format.base(ref)}`,
            });
          }

          return updated;
        };

        return builder
          .use(promise)
          .withMapper(this.mapper)
          .map({ key: 'mapProject' })
          .build();
      },
    });
  }

  async archiveProject(
    ref: IProjectRef,
    payload: RequiredField<Partial<IProject>, 'active'>,
  ): Promise<MappedProject> {
    return this.execute({
      fn: (builder) =>
        builder
          .use((session) =>
            this.deleteStrategy.softDelete(ref, payload, { session }),
          )
          .withConnection(this.connection)
          .withMapper(this.mapper)
          .map({ key: 'mapProject' })
          .build(),
    });
  }

  async deleteProject(ref: IProjectRef): Promise<void> {
    return this.execute({
      fn: (builder) =>
        builder
          .use((session) => this.deleteStrategy.hardDelete(ref, { session }))
          .withConnection(this.connection)
          .build(),
    });
  }
}
