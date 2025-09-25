import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '@shared/core';
import {
  IProject,
  IProjectFilter,
  IProjectRef,
  IProjectRepository,
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

  async findMany(filter: IProjectFilter): Promise<WithPagination<Project>> {
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
            .exec(),
        ]);

        return { data, sort, pagination: { ...pagination, total } };
      },
    });
  }

  async create(payload: IProject): Promise<Project> {
    return this.execute({
      fn: () => this.model.create(payload),
    });
  }

  async update(
    ref: IProjectRef,
    payload: Partial<IProject>,
  ): Promise<Project | null> {
    return this.execute({
      fn: () => this.model.findOneAndUpdate(ref, payload, { new: true }).exec(),
    });
  }

  async deleteOne(ref: IProjectRef): Promise<DeleteResult> {
    return this.execute({
      fn: () => this.model.deleteOne(ref).exec(),
    });
  }
}
