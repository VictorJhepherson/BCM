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
  TranslationFilterDTO,
  TranslationPayload,
  TranslationRefDTO,
} from '@shared/models';
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

  @Version('1')
  @HttpCode(200)
  @Get('/')
  async getAll(
    @Query(PaginationPipe) query: TranslationFilterDTO,
  ): Promise<MappedTranslation> {
    return this.execute({
      fn: () => this.service.getAll(query),
    });
  }

  @Version('1')
  @HttpCode(200)
  @Get('/projects/:projectId/languages/:languageId')
  async getById(
    @Param() params: TranslationRefDTO,
  ): Promise<TranslationPayload> {
    return this.execute({
      fn: () => this.service.getById(params),
    });
  }

  @Version('1')
  @HttpCode(201)
  @Post('/')
  async addTranslation(@Body() body: TranslationAddDTO): Promise<Translation> {
    return this.execute({
      fn: () => this.service.addTranslation(body),
    });
  }

  @Version('1')
  @HttpCode(200)
  @Patch('/projects/:projectId/languages/:languageId')
  async editTranslation(
    @Param() params: TranslationRefDTO,
    @Body() body: TranslationEditDTO,
  ): Promise<Translation> {
    return this.execute({
      fn: () => this.service.editTranslation(params, body),
    });
  }

  @Version('1')
  @HttpCode(204)
  @Delete('/projects/:projectId/languages/:languageId')
  async deleteTranslation(@Param() params: TranslationRefDTO): Promise<void> {
    return this.execute({
      fn: () => this.service.deleteTranslation(params),
    });
  }
}
