import { TranslationMapper } from '@/modules/translations/mappers/translations.mapper';
import { ITranslationService } from '@/modules/translations/models';
import { TranslationRepository } from '@/modules/translations/repositories/translations.repository';
import { BaseService } from '@/shared/core';
import { format } from '@/shared/helpers';
import { LoggerProvider } from '@/shared/providers';

import {
  ITranslationEntity,
  ITranslationFilter,
  IUTranslationFilter,
  TBody,
  TMappedTranslation,
  TQuery,
  TTranslation,
  TWithPagination,
} from '@bcm/models';

import { Injectable, NotFoundException } from '@nestjs/common';

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
  }: TQuery<ITranslationFilter>): Promise<TWithPagination<TMappedTranslation>> {
    return this.run({
      fn: (builder) =>
        builder
          .use(() => this.repository.findMany({ filter }))
          .useMapper(this.mapper)
          .map({ key: 'mapTranslations' })
          .execute(),
    });
  }

  async getById({
    filter,
  }: TQuery<IUTranslationFilter>): Promise<TMappedTranslation> {
    return this.run({
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
          .useMapper(this.mapper)
          .map({ key: 'mapTranslation' })
          .execute();
      },
    });
  }

  async addTranslation({
    payload,
  }: TBody<ITranslationEntity>): Promise<TTranslation> {
    return this.run({
      fn: () => this.repository.createOne({ payload }),
    });
  }

  async editTranslation({
    filter,
    payload,
  }: TQuery<
    IUTranslationFilter,
    Partial<ITranslationEntity>
  >): Promise<TMappedTranslation> {
    return this.run({
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
          .useMapper(this.mapper)
          .map({ key: 'mapTranslation' })
          .execute();
      },
    });
  }

  async archiveTranslation({
    filter,
    payload,
  }: TQuery<
    IUTranslationFilter,
    Pick<ITranslationEntity, 'active'>
  >): Promise<TMappedTranslation> {
    return this.run({
      fn: (builder) => {
        const promise = async () => {
          const updated = await this.repository.updateOne({ filter, payload });

          if (!updated) {
            throw new NotFoundException({
              message: `Unable to archive a translation for: ${format.base(filter)}`,
            });
          }

          return updated;
        };

        return builder
          .use(promise)
          .useMapper(this.mapper)
          .map({ key: 'mapTranslation' })
          .execute();
      },
    });
  }

  async deleteTranslation({
    filter,
  }: TQuery<IUTranslationFilter>): Promise<void> {
    return this.run({
      fn: (builder) => {
        const promise = async () => {
          await this.repository.deleteOne({ filter });
        };

        return builder.use(promise).execute();
      },
    });
  }
}
