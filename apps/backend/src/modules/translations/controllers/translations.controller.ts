import {
  ITranslationController,
  TranslationAddDTO,
  TranslationArchiveDTO,
  TranslationEditDTO,
  TranslationFilterDTO,
  UTranslationFilterDTO,
} from '@/modules/translations/models';
import { TranslationService } from '@/modules/translations/services/translations.service';
import { BaseController } from '@/shared/core';
import { Filter, Groups, Payload, Scopes } from '@/shared/decorators';
import { PaginationPipe } from '@/shared/pipes';
import { LoggerProvider } from '@/shared/providers';

import { TMappedTranslation, TTranslation, TWithPagination } from '@bcm/models';

import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
  Version,
} from '@nestjs/common';

@Controller('/translations')
export class TranslationController
  extends BaseController
  implements ITranslationController
{
  constructor(
    logger: LoggerProvider,
    private readonly service: TranslationService,
  ) {
    super('[translations]', logger);
  }

  @Get('/')
  @Version('1')
  @HttpCode(200)
  @Scopes(['PROJECTS'])
  @Groups(['VIEWER', 'EDITOR', 'ADMIN'])
  async getAll(
    @Filter(PaginationPipe) filter: TranslationFilterDTO,
  ): Promise<TWithPagination<TMappedTranslation>> {
    return this.run({
      fn: () => this.service.getAll({ filter }),
    });
  }

  @Get('/:_id')
  @Version('1')
  @HttpCode(200)
  @Scopes(['PROJECTS'])
  @Groups(['VIEWER', 'EDITOR', 'ADMIN'])
  async getById(
    @Filter() filter: UTranslationFilterDTO,
  ): Promise<TMappedTranslation> {
    return this.run({
      fn: () => this.service.getById({ filter }),
    });
  }

  @Post('/')
  @Version('1')
  @HttpCode(201)
  @Scopes(['PROJECTS'])
  @Groups(['EDITOR', 'ADMIN'])
  async addTranslation(
    @Payload() payload: TranslationAddDTO,
  ): Promise<TTranslation> {
    return this.run({
      fn: () => this.service.addTranslation({ payload }),
    });
  }

  @Patch('/:_id')
  @Version('1')
  @HttpCode(200)
  @Scopes(['PROJECTS'])
  @Groups(['EDITOR', 'ADMIN'])
  async editTranslation(
    @Filter() filter: UTranslationFilterDTO,
    @Payload() payload: TranslationEditDTO,
  ): Promise<TMappedTranslation> {
    return this.run({
      fn: () => this.service.editTranslation({ filter, payload }),
    });
  }

  @Patch('/archive/:_id')
  @Version('1')
  @HttpCode(200)
  @Scopes(['PROJECTS'])
  @Groups(['EDITOR', 'ADMIN'])
  async archiveTranslation(
    @Filter() filter: UTranslationFilterDTO,
    @Payload() payload: TranslationArchiveDTO,
  ): Promise<TMappedTranslation> {
    return this.run({
      fn: () => this.service.archiveTranslation({ filter, payload }),
    });
  }

  @Delete('/:_id')
  @Version('1')
  @HttpCode(204)
  @Scopes(['PROJECTS'])
  @Groups(['ADMIN'])
  async deleteTranslation(
    @Filter() filter: UTranslationFilterDTO,
  ): Promise<void> {
    return this.run({
      fn: () => this.service.deleteTranslation({ filter }),
    });
  }
}
