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
  AddLanguageDTO,
  EditLanguageDTO,
  ILanguageController,
  Language,
  LanguageFilter,
  MappedLanguage,
} from '@shared/models';
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
  async getAll(): Promise<MappedLanguage[]> {
    return this.execute({
      fn: () => this.service.getAll(),
    });
  }

  @Version('1')
  @HttpCode(201)
  @Post('/')
  async addLanguage(@Body() dto: AddLanguageDTO): Promise<Language> {
    return this.execute({
      fn: () => this.service.addLanguage(dto),
    });
  }

  @Version('1')
  @HttpCode(200)
  @Patch('/:_id')
  async editLanguage(
    @Param('_id') _id: LanguageFilter['_id'],
    @Body() dto: EditLanguageDTO,
  ): Promise<Language> {
    return this.execute({
      fn: () => this.service.editLanguage({ _id }, dto),
    });
  }

  @Version('1')
  @HttpCode(204)
  @Delete('/:_id')
  async deleteLanguage(
    @Param('_id') _id: LanguageFilter['_id'],
  ): Promise<void> {
    return this.execute({
      fn: () => this.service.deleteLanguage({ _id }),
    });
  }
}
