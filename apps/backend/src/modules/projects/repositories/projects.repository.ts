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
import { Model } from 'mongoose';

@Injectable()
export class ProjectRepository
  extends BaseRepository
  implements IProjectRepository
{
  constructor(
    @InjectModel(ProjectEntity.name)
    private readonly model: Model<ProjectEntity>,
  ) {
    super('[projects]');
  }

  async find(): Promise<Project[]> {
    return this.execute(() => this.model.find().exec());
  }

  async create(dto: AddProjectDTO): Promise<Project> {
    return this.execute(() => this.model.create(dto));
  }

  async update(
    filter: ProjectFilter,
    dto: EditProjectDTO,
  ): Promise<Project | null> {
    return this.execute(() =>
      this.model.findByIdAndUpdate(filter.id, dto, { new: true }).exec(),
    );
  }

  async delete(filter: ProjectFilter): Promise<Project | null> {
    return this.execute(() => this.model.findByIdAndDelete(filter.id).exec());
  }
}
