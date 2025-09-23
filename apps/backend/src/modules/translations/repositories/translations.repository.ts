import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '@shared/core';
import { format } from '@shared/helpers';
import {
  AddTranslationDTO,
  EditTranslationDTO,
  ITranslationRepository,
  PopulateTranslation,
  Translation,
  TranslationEntity,
  TranslationFilter,
} from '@shared/models';
import { Model } from 'mongoose';

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

  async getByProject(
    filter: Pick<TranslationFilter, 'projectId'>,
  ): Promise<PopulateTranslation[]> {
    return this.execute(async () => {
      const finded = await this.model
        .find(filter)
        .populate({ path: 'languageId', select: 'language' })
        .lean<PopulateTranslation[]>()
        .exec();

      if (!finded?.length) {
        throw new NotFoundException({
          message: `Unable to find translation(s) by: ${format.base(filter)}`,
        });
      }

      return finded;
    });
  }

  async getByLanguage(filter: TranslationFilter): Promise<PopulateTranslation> {
    return this.execute(async () => {
      const finded = await this.model
        .findOne(filter)
        .populate({ path: 'languageId', select: 'language' })
        .lean<PopulateTranslation>()
        .exec();

      if (!finded) {
        throw new NotFoundException({
          message: `Unable to find translation by: ${format.base(filter)}`,
        });
      }

      return finded;
    });
  }

  async addTranslation(dto: AddTranslationDTO): Promise<Translation> {
    return this.execute(async () => {
      const added = await this.model.create(dto);

      if (!added) {
        throw new InternalServerErrorException({
          message: `Failed to create a translation for: ${format.base(dto)}`,
        });
      }

      return added.save();
    });
  }

  async editTranslation(
    filter: TranslationFilter,
    dto: EditTranslationDTO,
  ): Promise<Translation> {
    return this.execute(async () => {
      const edited = await this.model.findOneAndUpdate(filter, dto, {
        new: true,
      });

      if (!edited) {
        throw new NotFoundException({
          message: `Unable to find a translation for: ${format.base(filter)}`,
        });
      }

      return edited.save();
    });
  }

  async removeByProject(
    filter: Pick<TranslationFilter, 'projectId'>,
  ): Promise<void> {
    return this.execute(async () => {
      const deleted = await this.model.deleteMany(filter);

      if (deleted.deletedCount < 1) {
        throw new NotFoundException({
          message: `Failed to delete translation(s) for: ${format.base(filter)}`,
        });
      }
    });
  }

  async removeByLanguage(filter: TranslationFilter): Promise<void> {
    return this.execute(async () => {
      const deleted = await this.model.deleteOne(filter);

      if (deleted.deletedCount < 1) {
        throw new NotFoundException({
          message: `Failed to delete a translation for: ${format.base(filter)}`,
        });
      }
    });
  }
}
