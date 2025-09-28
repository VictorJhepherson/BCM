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
  FlatProject,
  IProjectController,
  MappedProject,
  Project,
  ProjectAddDTO,
  ProjectArchiveDTO,
  ProjectEditDTO,
  ProjectFilterDTO,
  ProjectPayload,
  ProjectRefDTO,
} from '@shared/models';
import { Groups, Scopes } from '../../../decorators';
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

  @Get('/')
  @Version('1')
  @HttpCode(200)
  @Scopes(['PROJECTS'])
  @Groups(['VIEWER', 'EDITOR', 'ADMIN'])
  async getAll(
    @Query(PaginationPipe) query: ProjectFilterDTO,
  ): Promise<MappedProject> {
    return this.execute({
      fn: () => this.service.getAll(query),
    });
  }

  @Get('/:_id')
  @Version('1')
  @HttpCode(200)
  @Scopes(['PROJECTS'])
  @Groups(['VIEWER', 'EDITOR', 'ADMIN'])
  async getById(params: ProjectRefDTO): Promise<ProjectPayload> {
    return this.execute({
      fn: () => this.service.getById(params),
    });
  }

  @Post('/')
  @Version('1')
  @HttpCode(201)
  @Scopes(['PROJECTS'])
  @Groups(['EDITOR', 'ADMIN'])
  async addProject(@Body() body: ProjectAddDTO): Promise<Project> {
    return this.execute({
      fn: () => this.service.addProject(body),
    });
  }

  @Patch('/:_id')
  @Version('1')
  @HttpCode(200)
  @Scopes(['PROJECTS'])
  @Groups(['EDITOR', 'ADMIN'])
  async editProject(
    @Param() params: ProjectRefDTO,
    @Body() body: ProjectEditDTO,
  ): Promise<FlatProject> {
    return this.execute({
      fn: () => this.service.editProject(params, body),
    });
  }

  @Patch('/archive/:_id')
  @Version('1')
  @HttpCode(200)
  @Scopes(['PROJECTS'])
  @Groups(['EDITOR', 'ADMIN'])
  async archiveProject(
    @Param() params: ProjectRefDTO,
    @Body() body: ProjectArchiveDTO,
  ): Promise<FlatProject> {
    return this.execute({
      fn: () => this.service.archiveProject(params, body),
    });
  }

  @Delete('/:_id')
  @Version('1')
  @HttpCode(204)
  @Scopes(['PROJECTS'])
  @Groups(['ADMIN'])
  async deleteProject(@Param() params: ProjectRefDTO): Promise<void> {
    return this.execute({
      fn: () => this.service.deleteProject(params),
    });
  }
}
