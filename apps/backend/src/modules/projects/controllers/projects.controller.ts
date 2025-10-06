import {
  IProjectController,
  ProjectAddDTO,
  ProjectArchiveDTO,
  ProjectEditDTO,
  ProjectFilterDTO,
  UProjectFilterDTO,
} from '@/modules/projects/models';
import { ProjectService } from '@/modules/projects/services/projects.service';
import { BaseController } from '@/shared/core';
import { Filter, Groups, Payload, Scopes } from '@/shared/decorators';
import { PaginationPipe } from '@/shared/pipes';
import { LoggerProvider } from '@/shared/providers';

import { TMappedProject, TProject, TWithPagination } from '@bcm/models';

import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
  Version,
} from '@nestjs/common';

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
    @Filter(PaginationPipe) filter: ProjectFilterDTO,
  ): Promise<TWithPagination<TMappedProject>> {
    return this.run({
      fn: () => this.service.getAll({ filter }),
    });
  }

  @Get('/:_id')
  @Version('1')
  @HttpCode(200)
  @Scopes(['PROJECTS'])
  @Groups(['VIEWER', 'EDITOR', 'ADMIN'])
  async getById(@Filter() filter: UProjectFilterDTO): Promise<TMappedProject> {
    return this.run({
      fn: () => this.service.getById({ filter }),
    });
  }

  @Post('/')
  @Version('1')
  @HttpCode(201)
  @Scopes(['PROJECTS'])
  @Groups(['EDITOR', 'ADMIN'])
  async addProject(@Payload() payload: ProjectAddDTO): Promise<TProject> {
    return this.run({
      fn: () => this.service.addProject({ payload }),
    });
  }

  @Patch('/:_id')
  @Version('1')
  @HttpCode(200)
  @Scopes(['PROJECTS'])
  @Groups(['EDITOR', 'ADMIN'])
  async editProject(
    @Filter() filter: UProjectFilterDTO,
    @Payload() payload: ProjectEditDTO,
  ): Promise<TMappedProject> {
    return this.run({
      fn: () => this.service.editProject({ filter, payload }),
    });
  }

  @Patch('/archive/:_id')
  @Version('1')
  @HttpCode(200)
  @Scopes(['PROJECTS'])
  @Groups(['EDITOR', 'ADMIN'])
  async archiveProject(
    @Filter() filter: UProjectFilterDTO,
    @Payload() payload: ProjectArchiveDTO,
  ): Promise<TMappedProject> {
    return this.run({
      fn: () => this.service.archiveProject({ filter, payload }),
    });
  }

  @Delete('/:_id')
  @Version('1')
  @HttpCode(204)
  @Scopes(['PROJECTS'])
  @Groups(['ADMIN'])
  async deleteProject(@Filter() filter: UProjectFilterDTO): Promise<void> {
    return this.run({
      fn: () => this.service.deleteProject({ filter }),
    });
  }
}
