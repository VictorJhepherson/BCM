import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '@shared/core';
import {
  AddLanguageDTO,
  EditLanguageDTO,
  ILanguageRepository,
  Language,
  LanguageEntity,
  LanguageFilter,
} from '@shared/models';
import { Model } from 'mongoose';

@Injectable()
export class LanguageRepository
  extends BaseRepository
  implements ILanguageRepository
{
  constructor(
    @InjectModel(LanguageEntity.name)
    private readonly model: Model<LanguageEntity>,
  ) {
    super('[languages]');
  }

  async find(): Promise<Language[]> {
    return this.execute(() => this.model.find().exec());
  }

  async create(dto: AddLanguageDTO): Promise<Language> {
    return this.execute(() => this.model.create(dto));
  }

  async update(
    filter: LanguageFilter,
    dto: EditLanguageDTO,
  ): Promise<Language | null> {
    return this.execute(() =>
      this.model.findByIdAndUpdate(filter.id, dto, { new: true }).exec(),
    );
  }

  async delete(filter: LanguageFilter): Promise<Language | null> {
    return this.execute(() => this.model.findByIdAndDelete(filter.id).exec());
  }
}
