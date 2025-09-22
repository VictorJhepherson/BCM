import { Injectable } from '@nestjs/common';
import { BaseService } from '@shared/core';
import {
  AddTranslationDTO,
  EditTranslationDTO,
  ITranslationService,
  MappedTranslation,
  Translation,
  TranslationFilter,
} from '@shared/models';
import {
  TranslationMapper,
  TranslationMapperType,
} from '../mappers/translations.mapper';
import { TranslationRepository } from '../repositories/translations.repository';

@Injectable()
export class TranslationService
  extends BaseService<TranslationMapperType>
  implements ITranslationService
{
  constructor(private readonly repository: TranslationRepository) {
    super('[translations]', new TranslationMapper());
  }

  async getByProject(
    filter: Pick<TranslationFilter, 'projectId'>,
  ): Promise<MappedTranslation[]> {
    return this.execute(async () => {
      const data = await this.repository.getByProject(filter);

      return this.map({ key: 'mapTranslations', data });
    });
  }

  async getByLanguage(filter: TranslationFilter): Promise<MappedTranslation> {
    return this.execute(async () => {
      const data = await this.repository.getByLanguage(filter);

      return this.map({ key: 'mapTranslation', data });
    });
  }

  async addTranslation(dto: AddTranslationDTO): Promise<Translation> {
    return this.execute(() => this.repository.addTranslation(dto));
  }

  async editTranslation(
    filter: TranslationFilter,
    dto: EditTranslationDTO,
  ): Promise<Translation> {
    return this.execute(() => this.repository.editTranslation(filter, dto));
  }

  async removeByProject(
    filter: Pick<TranslationFilter, 'projectId'>,
  ): Promise<void> {
    return this.execute(() => this.repository.removeByProject(filter));
  }

  async removeByLanguage(filter: TranslationFilter): Promise<void> {
    return this.execute(() => this.repository.removeByLanguage(filter));
  }
}
