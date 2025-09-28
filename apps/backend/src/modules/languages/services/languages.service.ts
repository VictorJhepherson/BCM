import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '@shared/core';
import { format } from '@shared/helpers';
import {
  ILanguage,
  ILanguageFilter,
  ILanguageRef,
  ILanguageService,
  Language,
  LanguagePayload,
  MappedLanguage,
  RequiredField,
} from '@shared/models';
import { LoggerProvider } from '../../../providers';
import {
  LanguageMapper,
  LanguageMapperType,
} from '../mappers/languages.mapper';
import { LanguageRepository } from '../repositories/languages.repository';
import { LanguageDeleteStrategy } from '../strategies';

@Injectable()
export class LanguageService
  extends BaseService<LanguageMapperType>
  implements ILanguageService
{
  constructor(
    logger: LoggerProvider,
    private readonly repository: LanguageRepository,
    private readonly deleteStrategy: LanguageDeleteStrategy,
  ) {
    super('[languages]', logger, new LanguageMapper());
  }

  async getAll(filter: ILanguageFilter): Promise<MappedLanguage> {
    return this.execute({
      mapKey: 'mapLanguages',
      fn: () => this.repository.findMany(filter),
    });
  }

  async getById(ref: ILanguageRef): Promise<LanguagePayload> {
    return this.execute({
      mapKey: 'mapLanguage',
      fn: async () => {
        const finded = await this.repository.findOne(ref);

        if (!finded) {
          throw new NotFoundException({
            message: `Unable to find a language for: ${format.base(ref)}`,
          });
        }

        return finded;
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
  ): Promise<Language> {
    return this.execute({
      fn: async () => {
        const updated = await this.repository.updateOne(ref, payload);

        if (!updated) {
          throw new NotFoundException({
            message: `Unable to find a language for: ${format.base(ref)}`,
          });
        }

        return updated;
      },
    });
  }

  async archiveLanguage(
    ref: ILanguageRef,
    payload: RequiredField<Partial<ILanguage>, 'active'>,
  ): Promise<Language> {
    return this.execute({
      fn: () => this.deleteStrategy.softDelete(ref, payload),
    });
  }

  async deleteLanguage(ref: ILanguageRef): Promise<void> {
    return this.execute({
      fn: () => this.deleteStrategy.hardDelete(ref),
    });
  }
}
