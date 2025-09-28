import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '@shared/core';
import { format } from '@shared/helpers';
import {
  FlatTranslation,
  ITranslation,
  ITranslationFilter,
  ITranslationRef,
  ITranslationService,
  MappedTranslation,
  Translation,
  TranslationPayload,
} from '@shared/models';
import { LoggerProvider } from '../../../providers';
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
  constructor(
    logger: LoggerProvider,
    private readonly repository: TranslationRepository,
  ) {
    super('[translations]', logger, new TranslationMapper());
  }

  async getAll(filter: ITranslationFilter): Promise<MappedTranslation> {
    return this.execute({
      mapKey: 'mapTranslations',
      fn: () => this.repository.findMany(filter),
    });
  }

  async getById(ref: ITranslationRef): Promise<TranslationPayload> {
    return this.execute({
      mapKey: 'mapTranslation',
      fn: async () => {
        const finded = await this.repository.findOne(ref);

        if (!finded) {
          throw new NotFoundException({
            message: `Unable to find a translation for: ${format.base(ref)}`,
          });
        }

        return finded;
      },
    });
  }

  async addTranslation(payload: ITranslation): Promise<Translation> {
    return this.execute({
      fn: () => this.repository.createOne(payload),
    });
  }

  async editTranslation(
    ref: ITranslationRef,
    payload: Partial<ITranslation>,
  ): Promise<FlatTranslation> {
    return this.execute({
      fn: async () => {
        const updated = await this.repository.updateOne(ref, payload);

        if (!updated) {
          throw new NotFoundException({
            message: `Unable to find a translation for: ${format.base(ref)}`,
          });
        }

        return updated;
      },
    });
  }

  async deleteTranslation(ref: ITranslationRef): Promise<void> {
    return this.execute({
      fn: async () => {
        const deleted = await this.repository.deleteOne(ref);

        if (deleted.deletedCount < 1) {
          throw new NotFoundException({
            message: `Failed to delete a translation for: ${format.base(ref)}`,
          });
        }
      },
    });
  }
}
