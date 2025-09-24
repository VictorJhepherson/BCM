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
import { DeleteResult, Model } from 'mongoose';

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

  async findMany(): Promise<Language[]> {
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
      this.model.findOneAndUpdate(filter, dto, { new: true }).exec(),
    );
  }

  async deleteOne(filter: LanguageFilter): Promise<DeleteResult> {
    return this.execute(() => this.model.deleteOne(filter).exec());
  }
}
