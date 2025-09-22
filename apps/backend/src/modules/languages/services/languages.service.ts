import { Injectable } from '@nestjs/common';
import { BaseService } from '@shared/core';
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
      const data = await this.repository.getAll();

      return this.map({ key: 'mapLanguages', data });
    });
  }

  async addLanguage(dto: AddLanguageDTO): Promise<Language> {
    return this.execute(() => this.repository.addLanguage(dto));
  }

  async editLanguage(
    filter: LanguageFilter,
    dto: EditLanguageDTO,
  ): Promise<Language> {
    return this.execute(() => this.repository.editLanguage(filter, dto));
  }

  async removeLanguage(filter: LanguageFilter): Promise<void> {
    return this.execute(() => this.repository.removeLanguage(filter));
  }
}
