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
  AddTranslationDTO,
  EditTranslationDTO,
  ITranslationController,
  MappedTranslation,
  Translation,
  TranslationFilter,
} from '@shared/models';
import { TranslationService } from '../services/translations.service';

@Controller('/translations')
export class TranslationController
  extends BaseController
  implements ITranslationController
{
  constructor(private readonly service: TranslationService) {
    super('[translations]');
  }

  @Version('1')
  @HttpCode(200)
  @Get('/:projectId')
  async getByProject(
    @Param('projectId') projectId: TranslationFilter['projectId'],
  ): Promise<MappedTranslation[]> {
    return this.execute(() => this.service.getByProject({ projectId }));
  }

  @Version('1')
  @HttpCode(200)
  @Get('/:projectId/:languageId')
  async getByLanguage(
    @Param('projectId') projectId: TranslationFilter['projectId'],
    @Param('languageId') languageId: TranslationFilter['languageId'],
  ): Promise<MappedTranslation> {
    return this.execute(() =>
      this.service.getByLanguage({ projectId, languageId }),
    );
  }

  @Version('1')
  @HttpCode(201)
  @Post('/')
  async addTranslation(@Body() dto: AddTranslationDTO): Promise<Translation> {
    return this.execute(() => this.service.addTranslation(dto));
  }

  @Version('1')
  @HttpCode(200)
  @Patch('/:projectId/:languageId')
  async editTranslation(
    @Param('projectId') projectId: TranslationFilter['projectId'],
    @Param('languageId') languageId: TranslationFilter['languageId'],
    @Body() dto: EditTranslationDTO,
  ): Promise<Translation> {
    return this.execute(() =>
      this.service.editTranslation({ projectId, languageId }, dto),
    );
  }

  @Version('1')
  @HttpCode(204)
  @Delete('/:projectId')
  async removeByProject(
    @Param('projectId') projectId: TranslationFilter['projectId'],
  ): Promise<void> {
    return this.execute(() => this.service.removeByProject({ projectId }));
  }

  @Version('1')
  @HttpCode(204)
  @Delete('/:projectId/:languageId')
  async removeByLanguage(
    @Param('projectId') projectId: TranslationFilter['projectId'],
    @Param('languageId') languageId: TranslationFilter['languageId'],
  ): Promise<void> {
    return this.execute(() =>
      this.service.removeByLanguage({ projectId, languageId }),
    );
  }
}
