import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '@shared/core';
import { format } from '@shared/helpers';
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
      const data = await this.repository.findMany(filter);

      return this.map({ key: 'mapTranslations', data });
    });
  }

  async getByLanguage(filter: TranslationFilter): Promise<MappedTranslation> {
    return this.execute(async () => {
      const data = await this.repository.findOne(filter);

      return this.map({ key: 'mapTranslation', data });
    });
  }

  async addTranslation(dto: AddTranslationDTO): Promise<Translation> {
    return this.execute(() => this.repository.create(dto));
  }

  async editTranslation(
    filter: TranslationFilter,
    dto: EditTranslationDTO,
  ): Promise<Translation> {
    return this.execute(async () => {
      const updated = await this.repository.update(filter, dto);

      if (!updated) {
        throw new NotFoundException({
          message: `Unable to find a translation for: ${format.base(filter)}`,
        });
      }

      return updated;
    });
  }

  async deleteByProject(
    filter: Pick<TranslationFilter, 'projectId'>,
  ): Promise<void> {
    return this.execute(async () => {
      const deleted = await this.repository.deleteMany(filter);

      if (deleted.deletedCount < 1) {
        throw new NotFoundException({
          message: `Failed to delete translation(s) for: ${format.base(filter)}`,
        });
      }
    });
  }

  async deleteByLanguage(filter: TranslationFilter): Promise<void> {
    return this.execute(async () => {
      const deleted = await this.repository.deleteOne(filter);

      if (deleted.deletedCount < 1) {
        throw new NotFoundException({
          message: `Failed to delete a translation for: ${format.base(filter)}`,
        });
      }
    });
  }
}
