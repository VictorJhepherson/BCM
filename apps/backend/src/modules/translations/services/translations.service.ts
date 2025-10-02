import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '@shared/core';
import { format } from '@shared/helpers';
import {
  ITranslation,
  ITranslationFilterPG,
  ITranslationService,
  MappedTranslation,
  TBody,
  TQuery,
  Translation,
  UFilterTranslation,
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

  async getAll({
    filter,
  }: TQuery<ITranslationFilterPG>): Promise<WithPagination<MappedTranslation>> {
    return this.execute({
      fn: (builder) =>
        builder
          .use(() => this.repository.findMany({ filter }))
          .withMapper(this.mapper)
          .map({ key: 'mapTranslations' })
          .build(),
    });
  }

  async getById({
    filter,
  }: TQuery<UFilterTranslation>): Promise<MappedTranslation> {
    return this.execute({
      fn: (builder) => {
        const promise = async () => {
          const finded = await this.repository.findOne({ filter });

          if (!finded) {
            throw new NotFoundException({
              message: `Unable to find a translation for: ${format.base(filter)}`,
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

  async addTranslation({ payload }: TBody<ITranslation>): Promise<Translation> {
    return this.execute({
      fn: () => this.repository.createOne({ payload }),
    });
  }

  async editTranslation({
    filter,
    payload,
  }: TQuery<
    UFilterTranslation,
    Partial<ITranslation>
  >): Promise<MappedTranslation> {
    return this.execute({
      fn: (builder) => {
        const promise = async () => {
          const updated = await this.repository.updateOne({ filter, payload });

          if (!updated) {
            throw new NotFoundException({
              message: `Unable to find a translation for: ${format.base(filter)}`,
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

  async deleteTranslation({
    filter,
  }: TQuery<UFilterTranslation>): Promise<void> {
    return this.execute({
      fn: async () => {
        await this.repository.deleteOne({ filter });
      },
    });
  }
}
