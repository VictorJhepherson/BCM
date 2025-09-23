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
import { ProjectService } from '../services/projects.service';

@Controller('/projects')
export class ProjectController
  extends BaseController
  implements IProjectController
{
  constructor(private readonly service: ProjectService) {
    super('[projects]');
  }

  @Version('1')
  @HttpCode(200)
  @Get('/')
  async getAll(): Promise<MappedProject[]> {
    return this.execute(() => this.service.getAll());
  }

  @Version('1')
  @HttpCode(201)
  @Post('/')
  async addProject(@Body() dto: AddProjectDTO): Promise<Project> {
    return this.execute(() => this.service.addProject(dto));
  }

  @Version('1')
  @HttpCode(200)
  @Patch('/:id')
  async editProject(
    @Param('id') id: ProjectFilter['id'],
    @Body() dto: EditProjectDTO,
  ): Promise<Project> {
    return this.execute(() => this.service.editProject({ id }, dto));
  }

  @Version('1')
  @HttpCode(204)
  @Delete('/:id')
  async deleteProject(@Param('id') id: ProjectFilter['id']): Promise<void> {
    return this.execute(() => this.service.deleteProject({ id }));
  }
}
