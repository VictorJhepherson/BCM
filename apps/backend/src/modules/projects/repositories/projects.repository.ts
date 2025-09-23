import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '@shared/core';
import { format } from '@shared/helpers';
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

  async getAll(): Promise<Project[]> {
    return this.execute(async () => {
      const finded = await this.model.find().exec();

      if (!finded?.length) {
        throw new NotFoundException({
          message: 'Unable to find all projects.',
        });
      }

      return finded;
    });
  }

  async addProject(dto: AddProjectDTO): Promise<Project> {
    return this.execute(async () => {
      const added = await this.model.create(dto);

      if (!added) {
        throw new InternalServerErrorException({
          message: `Failed to create a project for: ${format.base(dto)}`,
        });
      }

      return added.save();
    });
  }

  async editProject(
    { id }: ProjectFilter,
    dto: EditProjectDTO,
  ): Promise<Project> {
    return this.execute(async () => {
      const edited = await this.model.findOneAndUpdate({ _id: id }, dto, {
        new: true,
      });

      if (!edited) {
        throw new NotFoundException({
          message: `Unable to find a project for: ${id}`,
        });
      }

      return edited.save();
    });
  }

  async removeProject({ id }: ProjectFilter): Promise<void> {
    return this.execute(async () => {
      const deleted = await this.model.deleteOne({ _id: id });

      if (deleted.deletedCount < 1) {
        throw new NotFoundException({
          message: `Failed to delete a project for: ${id}`,
        });
      }
    });
  }
}
