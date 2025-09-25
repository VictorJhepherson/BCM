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
  LanguageEditDTO,
  LanguageFilterDTO,
  LanguageRefDTO,
  MappedLanguage,
} from '@shared/models';
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

  @Version('1')
  @HttpCode(200)
  @Get('/')
  async getAll(
    @Query(PaginationPipe) query: LanguageFilterDTO,
  ): Promise<MappedLanguage> {
    return this.execute({
      fn: () => this.service.getAll(query),
    });
  }

  @Version('1')
  @HttpCode(201)
  @Post('/')
  async addLanguage(@Body() body: LanguageAddDTO): Promise<Language> {
    return this.execute({
      fn: () => this.service.addLanguage(body),
    });
  }

  @Version('1')
  @HttpCode(200)
  @Patch('/:_id')
  async editLanguage(
    @Param() params: LanguageRefDTO,
    @Body() body: LanguageEditDTO,
  ): Promise<Language> {
    return this.execute({
      fn: () => this.service.editLanguage(params, body),
    });
  }

  @Version('1')
  @HttpCode(204)
  @Delete('/:_id')
  async deleteLanguage(@Param() params: LanguageRefDTO): Promise<void> {
    return this.execute({
      fn: () => this.service.deleteLanguage(params),
    });
  }
}
