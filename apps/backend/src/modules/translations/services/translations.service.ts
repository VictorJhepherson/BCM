import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '@shared/core';
import { format } from '@shared/helpers';
import {
  ITranslation,
  ITranslationFilterPG,
  ITranslationRef,
  ITranslationService,
  MappedTranslation,
  Translation,
  WithPagination,
} from '@shared/models';
import { LoggerProvider } from '../../../providers';
import { TranslationMapper } from '../mappers/translations.mapper';
import { TranslationRepository } from '../repositories/translations.repository';

@Injectable()
export class TranslationService
  extends BaseService
  implements ITranslationService
{
  constructor(
    logger: LoggerProvider,
    private readonly mapper: TranslationMapper,
    private readonly repository: TranslationRepository,
  ) {
    super('[translations]', logger);
  }

  async getAll(
    filter: ITranslationFilterPG,
  ): Promise<WithPagination<MappedTranslation>> {
    return this.execute({
      fn: (builder) =>
        builder
          .use(() => this.repository.findMany(filter))
          .withMapper(this.mapper)
          .map({ key: 'mapTranslations' })
          .build(),
    });
  }

  async getById(ref: ITranslationRef): Promise<MappedTranslation> {
    return this.execute({
      fn: (builder) => {
        const promise = async () => {
          const finded = await this.repository.findOne(ref);

          if (!finded) {
            throw new NotFoundException({
              message: `Unable to find a translation for: ${format.base(ref)}`,
            });
          }

          return finded;
        };

        return builder
          .use(promise)
          .withMapper(this.mapper)
          .map({ key: 'mapTranslation' })
          .build();
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
  ): Promise<MappedTranslation> {
    return this.execute({
      fn: (builder) => {
        const promise = async () => {
          const updated = await this.repository.updateOne(ref, payload);

          if (!updated) {
            throw new NotFoundException({
              message: `Unable to find a translation for: ${format.base(ref)}`,
            });
          }

          return updated;
        };

        return builder
          .use(promise)
          .withMapper(this.mapper)
          .map({ key: 'mapTranslation' })
          .build();
      },
    });
  }

  async deleteTranslation(ref: ITranslationRef): Promise<void> {
    return this.execute({
      fn: async () => {
        await this.repository.deleteOne(ref);
      },
    });
  }
}
