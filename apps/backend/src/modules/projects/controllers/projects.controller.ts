import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Version,
} from '@nestjs/common';
import { BaseController } from '@shared/core';
import {
  IProjectController,
  MappedProject,
  Project,
  ProjectAddDTO,
  ProjectEditDTO,
  ProjectFilterDTO,
  ProjectRefDTO,
} from '@shared/models';
import { PaginationPipe } from '../../../pipes';
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
  async getAll(
    @Query(PaginationPipe) query: ProjectFilterDTO,
  ): Promise<MappedProject> {
    return this.execute({
      fn: () => this.service.getAll(query),
    });
  }

  @Version('1')
  @HttpCode(201)
  @Post('/')
  async addProject(@Body() body: ProjectAddDTO): Promise<Project> {
    return this.execute({
      fn: () => this.service.addProject(body),
    });
  }

  @Version('1')
  @HttpCode(200)
  @Patch('/:_id')
  async editProject(
    @Param() params: ProjectRefDTO,
    @Body() body: ProjectEditDTO,
  ): Promise<Project> {
    return this.execute({
      fn: () => this.service.editProject(params, body),
    });
  }

  @Version('1')
  @HttpCode(204)
  @Delete('/:_id')
  async deleteProject(@Param() params: ProjectRefDTO): Promise<void> {
    return this.execute({
      fn: () => this.service.deleteProject(params),
    });
  }
}
