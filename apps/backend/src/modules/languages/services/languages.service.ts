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

@Injectable()
export class LanguageService extends BaseService implements ILanguageService {
  constructor(
    logger: LoggerProvider,
    private readonly mapper: LanguageMapper,
    @InjectConnection()
    private readonly connection: Connection,
    private readonly repository: LanguageRepository,
    private readonly deleteStrategy: LanguageDeleteStrategy,
  ) {
    super('[languages]', logger);
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
      fn: () => this.repository.createOne(payload),
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
          .use((session) =>
            this.deleteStrategy.softDelete(ref, payload, { session }),
          )
          .withConnection(this.connection)
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
          .withConnection(this.connection)
          .build(),
    });
  }
}
