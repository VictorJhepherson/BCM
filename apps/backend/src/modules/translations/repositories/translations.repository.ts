import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '@shared/core';
import {
  AddTranslationDTO,
  EditTranslationDTO,
  ITranslationRepository,
  PopulateTranslation,
  Translation,
  TranslationEntity,
  TranslationFilter,
} from '@shared/models';
import { DeleteResult, Model } from 'mongoose';

@Injectable()
export class TranslationRepository
  extends BaseRepository
  implements ITranslationRepository
{
  constructor(
    @InjectModel(TranslationEntity.name)
    private readonly model: Model<TranslationEntity>,
  ) {
    super('[translations]');
  }

  async findMany(
    filter: Pick<TranslationFilter, 'projectId'>,
  ): Promise<PopulateTranslation[]> {
    return this.execute(() =>
      this.model
        .find(filter)
        .populate({ path: 'languageId', select: 'language' })
        .lean<PopulateTranslation[]>()
        .exec(),
    );
  }

  async findOne(filter: TranslationFilter): Promise<PopulateTranslation> {
    return this.execute(() =>
      this.model
        .find(filter)
        .populate({ path: 'languageId', select: 'language' })
        .lean<PopulateTranslation>()
        .exec(),
    );
  }

  async create(dto: AddTranslationDTO): Promise<Translation> {
    return this.execute(() => this.model.create(dto));
  }

  async update(
    filter: TranslationFilter,
    dto: EditTranslationDTO,
  ): Promise<Translation | null> {
    return this.execute(() =>
      this.model.findOneAndUpdate(filter, dto, { new: true }).exec(),
    );
  }

  async deleteMany(
    filter: Pick<TranslationFilter, 'projectId'>,
  ): Promise<DeleteResult> {
    return this.execute(() => this.model.deleteMany(filter).exec());
  }

  async deleteOne(filter: TranslationFilter): Promise<DeleteResult> {
    return this.execute(() => this.model.deleteOne(filter).exec());
  }
}
