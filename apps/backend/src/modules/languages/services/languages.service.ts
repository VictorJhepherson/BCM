import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '@shared/core';
import { format } from '@shared/helpers';
import {
  AddLanguageDTO,
  EditLanguageDTO,
  ILanguageService,
  Language,
  LanguageFilter,
  MappedLanguage,
} from '@shared/models';
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
  constructor(private readonly repository: LanguageRepository) {
    super('[languages]', new LanguageMapper());
  }

  async getAll(): Promise<MappedLanguage[]> {
    return this.execute(async () => {
      const data = await this.repository.find();

      return this.map({ key: 'mapLanguages', data });
    });
  }

  async addLanguage(dto: AddLanguageDTO): Promise<Language> {
    return this.execute(() => this.repository.create(dto));
  }

  async editLanguage(
    filter: LanguageFilter,
    dto: EditLanguageDTO,
  ): Promise<Language> {
    return this.execute(async () => {
      const updated = await this.repository.update(filter, dto);

      if (!updated) {
        throw new NotFoundException({
          message: `Unable to find a language for: ${format.base(filter)}`,
        });
      }

      return updated;
    });
  }

  async deleteLanguage(filter: LanguageFilter): Promise<void> {
    return this.execute(async () => {
      const deleted = await this.repository.delete(filter);

      if (!deleted) {
        throw new NotFoundException({
          message: `Failed to delete a language for: ${format.base(filter)}`,
        });
      }
    });
  }
}
