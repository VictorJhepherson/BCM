import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { BaseService } from '@shared/core';
import { format } from '@shared/helpers';
import {
  ILanguage,
  ILanguageFilter,
  ILanguageRef,
  ILanguageService,
  Language,
  MappedLanguage,
  RequiredField,
  WithPagination,
} from '@shared/models';
import { Connection } from 'mongoose';
import { LoggerProvider } from '../../../providers';
import { LanguageMapper } from '../mappers/languages.mapper';
import { LanguageRepository } from '../repositories/languages.repository';
import { LanguageDeleteStrategy } from '../strategies';

export type Mappers<T> = {
  [K in keyof T]: T[K] extends (arg: infer A) => infer R
    ? (arg: A) => R
    : never;
};

@Injectable()
export class LanguageService extends BaseService implements ILanguageService {
  private readonly mapper: LanguageMapper;

  constructor(
    logger: LoggerProvider,
    @InjectConnection()
    private readonly connection: Connection,
    private readonly repository: LanguageRepository,
    private readonly deleteStrategy: LanguageDeleteStrategy,
  ) {
    super('[languages]', logger);

    this.mapper = new LanguageMapper();
  }

  async getAll(
    filter: ILanguageFilter,
  ): Promise<WithPagination<MappedLanguage>> {
    return this.execute({
      fn: (builder) =>
        builder
          .use(() => this.repository.findMany(filter))
          .withMapper(this.mapper)
          .map({ key: 'mapLanguages' })
          .build(),
    });
  }

  async getById(ref: ILanguageRef): Promise<MappedLanguage> {
    return this.execute({
      fn: (builder) => {
        const promise = async () => {
          const finded = await this.repository.findOne(ref);

          if (!finded) {
            throw new NotFoundException({
              message: `Unable to find a language for: ${format.base(ref)}`,
            });
          }

          return finded;
        };

        return builder
          .use(promise)
          .withMapper(this.mapper)
          .map({ key: 'mapLanguage' })
          .build();
      },
    });
  }

  async addLanguage(payload: ILanguage): Promise<Language> {
    return this.execute({
      fn: (builder) =>
        builder.use(() => this.repository.createOne(payload)).build(),
    });
  }

  async editLanguage(
    ref: ILanguageRef,
    payload: Partial<ILanguage>,
  ): Promise<MappedLanguage> {
    return this.execute({
      fn: (builder) => {
        const promise = async () => {
          const updated = await this.repository.updateOne(ref, payload);

          if (!updated) {
            throw new NotFoundException({
              message: `Unable to find a language for: ${format.base(ref)}`,
            });
          }

          return updated;
        };

        return builder
          .use(promise)
          .withMapper(this.mapper)
          .map({ key: 'mapLanguage' })
          .build();
      },
    });
  }

  async archiveLanguage(
    ref: ILanguageRef,
    payload: RequiredField<Partial<ILanguage>, 'active'>,
  ): Promise<MappedLanguage> {
    return this.execute({
      fn: (builder) =>
        builder
          .use(() => this.deleteStrategy.softDelete(ref, payload))
          .withMapper(this.mapper)
          .map({ key: 'mapLanguage' })
          .build(),
    });
  }

  async deleteLanguage(ref: ILanguageRef): Promise<void> {
    return this.execute({
      fn: (builder) =>
        builder
          .use((session) => this.deleteStrategy.hardDelete(ref, { session }))
          .withTransaction(this.connection)
          .build(),
    });
  }
}
