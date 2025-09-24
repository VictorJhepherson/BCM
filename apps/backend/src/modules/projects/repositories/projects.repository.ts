import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '@shared/core';
import {
  AddProjectDTO,
  EditProjectDTO,
  IProjectRepository,
  Project,
  ProjectEntity,
  ProjectFilter,
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

  async findMany(): Promise<Project[]> {
    return this.execute({
      fn: () => this.model.find().exec(),
    });
  }

  async create(dto: AddProjectDTO): Promise<Project> {
    return this.execute({
      fn: () => this.model.create(dto),
    });
  }

  async update(
    filter: ProjectFilter,
    dto: EditProjectDTO,
  ): Promise<Project | null> {
    return this.execute({
      fn: () => this.model.findOneAndUpdate(filter, dto, { new: true }).exec(),
    });
  }

  async deleteOne(filter: ProjectFilter): Promise<DeleteResult> {
    return this.execute({
      fn: () => this.model.deleteOne(filter).exec(),
    });
  }
}
