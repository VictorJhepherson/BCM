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
  ITranslationController,
  MappedTranslation,
  Translation,
  TranslationAddDTO,
  TranslationEditDTO,
  TranslationFilterPGDTO,
  TranslationRefDTO,
  WithPagination,
} from '@shared/models';
import { Groups, Scopes } from '../../../decorators';
import { PaginationPipe } from '../../../pipes';
import { LoggerProvider } from '../../../providers';
import { TranslationService } from '../services/translations.service';

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
  @Scopes(['TRANSLATIONS'])
  @Groups(['VIEWER', 'EDITOR', 'ADMIN'])
  async getAll(
    @Query(PaginationPipe) query: TranslationFilterPGDTO,
  ): Promise<WithPagination<MappedTranslation>> {
    return this.execute({
      fn: () => this.service.getAll(query),
    });
  }

  @Get('/projects/:project/languages/:language')
  @Version('1')
  @HttpCode(200)
  @Scopes(['TRANSLATIONS'])
  @Groups(['VIEWER', 'EDITOR', 'ADMIN'])
  async getById(
    @Param() params: TranslationRefDTO,
  ): Promise<MappedTranslation> {
    return this.execute({
      fn: () => this.service.getById(params),
    });
  }

  @Post('/')
  @Version('1')
  @HttpCode(201)
  @Scopes(['TRANSLATIONS'])
  @Groups(['EDITOR', 'ADMIN'])
  async addTranslation(@Body() body: TranslationAddDTO): Promise<Translation> {
    return this.execute({
      fn: () => this.service.addTranslation(body),
    });
  }

  @Patch('/projects/:project/languages/:language')
  @Version('1')
  @HttpCode(200)
  @Scopes(['TRANSLATIONS'])
  @Groups(['EDITOR', 'ADMIN'])
  async editTranslation(
    @Param() params: TranslationRefDTO,
    @Body() body: TranslationEditDTO,
  ): Promise<MappedTranslation> {
    return this.execute({
      fn: () => this.service.editTranslation(params, body),
    });
  }

  @Delete('/projects/:project/languages/:language')
  @Version('1')
  @HttpCode(204)
  @Scopes(['TRANSLATIONS'])
  @Groups(['EDITOR', 'ADMIN'])
  async deleteTranslation(@Param() params: TranslationRefDTO): Promise<void> {
    return this.execute({
      fn: () => this.service.deleteTranslation(params),
    });
  }
}
