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
  ILanguageController,
  Language,
  LanguageAddDTO,
  LanguageArchiveDTO,
  LanguageEditDTO,
  LanguageFilterPGDTO,
  LanguageRefDTO,
  MappedLanguage,
  WithPagination,
} from '@shared/models';
import { Groups, Scopes } from '../../../decorators';
import { PaginationPipe } from '../../../pipes';
import { LoggerProvider } from '../../../providers';
import { LanguageService } from '../services/languages.service';

@Controller('/languages')
export class LanguageController
  extends BaseController
  implements ILanguageController
{
  constructor(
    logger: LoggerProvider,
    private readonly service: LanguageService,
  ) {
    super('[languages]', logger);
  }

  @Get('/')
  @Version('1')
  @HttpCode(200)
  @Scopes(['LANGUAGES'])
  @Groups(['VIEWER', 'EDITOR', 'ADMIN'])
  async getAll(
    @Query(PaginationPipe) query: LanguageFilterPGDTO,
  ): Promise<WithPagination<MappedLanguage>> {
    return this.execute({
      fn: () => this.service.getAll(query),
    });
  }

  @Get('/:_id')
  @Version('1')
  @HttpCode(200)
  @Scopes(['LANGUAGES'])
  @Groups(['VIEWER', 'EDITOR', 'ADMIN'])
  async getById(params: LanguageRefDTO): Promise<MappedLanguage> {
    return this.execute({
      fn: () => this.service.getById(params),
    });
  }

  @Post('/')
  @Version('1')
  @HttpCode(201)
  @Scopes(['LANGUAGES'])
  @Groups(['EDITOR', 'ADMIN'])
  async addLanguage(@Body() body: LanguageAddDTO): Promise<Language> {
    return this.execute({
      fn: () => this.service.addLanguage(body),
    });
  }

  @Patch('/:_id')
  @Version('1')
  @HttpCode(200)
  @Scopes(['LANGUAGES'])
  @Groups(['EDITOR', 'ADMIN'])
  async editLanguage(
    @Param() params: LanguageRefDTO,
    @Body() body: LanguageEditDTO,
  ): Promise<MappedLanguage> {
    return this.execute({
      fn: () => this.service.editLanguage(params, body),
    });
  }

  @Patch('/archive/:_id')
  @Version('1')
  @HttpCode(200)
  @Scopes(['LANGUAGES'])
  @Groups(['EDITOR', 'ADMIN'])
  async archiveLanguage(
    @Param() params: LanguageRefDTO,
    @Body() body: LanguageArchiveDTO,
  ): Promise<MappedLanguage> {
    return this.execute({
      fn: () => this.service.archiveLanguage(params, body),
    });
  }

  @Delete('/:_id')
  @Version('1')
  @HttpCode(204)
  @Scopes(['LANGUAGES'])
  @Groups(['ADMIN'])
  async deleteLanguage(@Param() params: LanguageRefDTO): Promise<void> {
    return this.execute({
      fn: () => this.service.deleteLanguage(params),
    });
  }
}
