import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '@shared/core';
import { format } from '@shared/helpers';
import {
  ILanguage,
  ILanguageFilter,
  ILanguageRef,
  ILanguageService,
  Language,
  MappedLanguage,
} from '@shared/models';
import { LoggerProvider } from '../../../providers';
import {
  LanguageMapper,
  LanguageMapperType,
} from '../mappers/languages.mapper';
import { LanguageRepository } from '../repositories/languages.repository';

@Injectable()
export class LanguageService
  extends BaseService<LanguageMapperType>
  implements ILanguageService
{
  constructor(
    logger: LoggerProvider,
    private readonly repository: LanguageRepository,
  ) {
    super('[languages]', logger, new LanguageMapper());
  }

  async getAll(filter: ILanguageFilter): Promise<MappedLanguage> {
    return this.execute({
      mapKey: 'mapLanguages',
      fn: () => this.repository.findMany(filter),
    });
  }

  async addLanguage(payload: ILanguage): Promise<Language> {
    return this.execute({
      fn: () => this.repository.create(payload),
    });
  }

  async editLanguage(
    ref: ILanguageRef,
    payload: Partial<ILanguage>,
  ): Promise<Language> {
    return this.execute({
      fn: async () => {
        const updated = await this.repository.update(ref, payload);

        if (!updated) {
          throw new NotFoundException({
            message: `Unable to find a language for: ${format.base(ref)}`,
          });
        }

        return updated;
      },
    });
  }

  async deleteLanguage(ref: ILanguageRef): Promise<void> {
    return this.execute({
      fn: async () => {
        const deleted = await this.repository.deleteOne(ref);

        if (deleted.deletedCount < 1) {
          throw new NotFoundException({
            message: `Failed to delete a language for: ${format.base(ref)}`,
          });
        }
      },
    });
  }
}
