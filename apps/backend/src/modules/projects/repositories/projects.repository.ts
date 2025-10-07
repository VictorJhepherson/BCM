import { IProjectRepository, ProjectEntity } from '@/modules/projects/models';
import { BaseRepository } from '@/shared/core';
import { IQueryOptions } from '@/shared/models';
import { LoggerProvider } from '@/shared/providers';

import {
  IProjectEntity,
  IProjectFilter,
  IUProjectFilter,
  TBody,
  TFlatProject,
  TProject,
  TQuery,
  TWithPagination,
} from '@bcm/models';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult, Model } from 'mongoose';

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

  async findOne({
    filter,
  }: TQuery<IUProjectFilter>): Promise<TFlatProject | null> {
    return this.run({
      fn: () => this.model.findOne(filter).lean<TFlatProject>().exec(),
    });
  }

  async findMany({
    filter,
  }: TQuery<IProjectFilter>): Promise<TWithPagination<TFlatProject>> {
    const { sort, pagination, ...filters } = filter;

    return this.run({
      fn: async () => {
        const [total, data] = await Promise.all([
          this.model.countDocuments(filters).exec(),
          this.model
            .find(filters)
            .sort({ [sort.by]: sort.order === 'ASC' ? 1 : -1 })
            .skip(pagination.skip)
            .limit(pagination.limit)
            .lean<TFlatProject[]>()
            .exec(),
        ]);

        return { data, sort, pagination: { ...pagination, total } };
      },
    });
  }

  async createOne({ payload }: TBody<IProjectEntity>): Promise<TProject> {
    return this.run({
      fn: () => this.model.create(payload),
    });
  }

  async updateOne(
    { filter, payload }: TQuery<IUProjectFilter, Partial<IProjectEntity>>,
    { session }: IQueryOptions = {},
  ): Promise<TFlatProject | null> {
    return this.run({
      fn: () =>
        this.model
          .findOneAndUpdate(filter, payload, { new: true, session })
          .lean<TFlatProject>()
          .exec(),
    });
  }

  async deleteOne(
    { filter }: TQuery<IUProjectFilter>,
    { session }: IQueryOptions = {},
  ): Promise<DeleteResult> {
    return this.run({
      fn: () => this.model.deleteOne(filter, { session }).exec(),
    });
  }
}
