import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Version,
} from '@nestjs/common';
import { BaseController } from '@shared/core';
import {
  AddProjectDTO,
  EditProjectDTO,
  IProjectController,
  MappedProject,
  Project,
  ProjectFilter,
} from '@shared/models';
import { LoggerProvider } from '../../../providers';
import { ProjectService } from '../services/projects.service';

@Controller('/projects')
export class ProjectController
  extends BaseController
  implements IProjectController
{
  constructor(
    logger: LoggerProvider,
    private readonly service: ProjectService,
  ) {
    super('[projects]', logger);
  }

  @Version('1')
  @HttpCode(200)
  @Get('/')
  async getAll(): Promise<MappedProject[]> {
    return this.execute({
      fn: () => this.service.getAll(),
    });
  }

  @Version('1')
  @HttpCode(201)
  @Post('/')
  async addProject(@Body() dto: AddProjectDTO): Promise<Project> {
    return this.execute({
      fn: () => this.service.addProject(dto),
    });
  }

  @Version('1')
  @HttpCode(200)
  @Patch('/:_id')
  async editProject(
    @Param('_id') _id: ProjectFilter['_id'],
    @Body() dto: EditProjectDTO,
  ): Promise<Project> {
    return this.execute({
      fn: () => this.service.editProject({ _id }, dto),
    });
  }

  @Version('1')
  @HttpCode(204)
  @Delete('/:_id')
  async deleteProject(@Param('_id') _id: ProjectFilter['_id']): Promise<void> {
    return this.execute({
      fn: () => this.service.deleteProject({ _id }),
    });
  }
}
