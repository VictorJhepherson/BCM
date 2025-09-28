import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '@shared/core';
import {
  FlatProject,
  IProject,
  IProjectFilter,
  IProjectRef,
  IProjectRepository,
  IQueryOptions,
  Project,
  ProjectEntity,
  WithPagination,
} from '@shared/models';
import { DeleteResult, Model } from 'mongoose';
import { LoggerProvider } from '../../../providers';

@Injectable()
export class ProjectRepository
  extends BaseRepository
  implements IProjectRepository
{
  constructor(
    logger: LoggerProvider,
    @InjectModel(ProjectEntity.name)
    private readonly model: Model<ProjectEntity>,
  ) {
    super('[projects]', logger);
  }

  async findOne(ref: IProjectRef): Promise<FlatProject | null> {
    return this.execute({
      fn: () => this.model.findOne(ref).lean<FlatProject>().exec(),
    });
  }

  async findMany(filter: IProjectFilter): Promise<WithPagination<FlatProject>> {
    const { sort, pagination } = filter;

    return this.execute({
      fn: async () => {
        const [total, data] = await Promise.all([
          this.model.countDocuments().exec(),
          this.model
            .find()
            .sort({ [sort.by]: sort.order === 'ASC' ? 1 : -1 })
            .skip(pagination.skip)
            .limit(pagination.limit)
            .lean<FlatProject[]>()
            .exec(),
        ]);

        return { data, sort, pagination: { ...pagination, total } };
      },
    });
  }

  async createOne(payload: IProject): Promise<Project> {
    return this.execute({
      fn: () => this.model.create(payload),
    });
  }

  async updateOne(
    ref: IProjectRef,
    payload: Partial<IProject>,
    options?: IQueryOptions,
  ): Promise<FlatProject | null> {
    return this.execute({
      fn: () =>
        this.model
          .findOneAndUpdate(ref, payload, { new: true, ...options })
          .lean<FlatProject>()
          .exec(),
    });
  }

  async deleteOne(
    ref: IProjectRef,
    options?: IQueryOptions,
  ): Promise<DeleteResult> {
    return this.execute({
      fn: () => this.model.deleteOne(ref, options).exec(),
    });
  }
}
