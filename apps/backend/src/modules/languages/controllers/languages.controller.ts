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
import { LanguageService } from '../services/languages.service';

@Controller('/languages')
export class LanguageController
  extends BaseController
  implements ILanguageController
{
  constructor(private readonly service: LanguageService) {
    super('[languages]');
  }

  @Version('1')
  @HttpCode(200)
  @Get('/')
  async getAll(): Promise<MappedLanguage[]> {
    return this.execute(() => this.service.getAll());
  }

  @Version('1')
  @HttpCode(201)
  @Post('/')
  async addLanguage(@Body() dto: AddLanguageDTO): Promise<Language> {
    return this.execute(() => this.service.addLanguage(dto));
  }

  @Version('1')
  @HttpCode(200)
  @Patch('/:id')
  async editLanguage(
    @Param('id') id: LanguageFilter['id'],
    @Body() dto: EditLanguageDTO,
  ): Promise<Language> {
    return this.execute(() => this.service.editLanguage({ id }, dto));
  }

  @Version('1')
  @HttpCode(204)
  @Delete('/:id')
  async deleteLanguage(@Param('id') id: LanguageFilter['id']): Promise<void> {
    return this.execute(() => this.service.deleteLanguage({ id }));
  }
}
