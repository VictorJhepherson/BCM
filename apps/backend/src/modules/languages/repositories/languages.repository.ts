import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '@shared/core';
import { format } from '@shared/helpers';
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

  async getAll(): Promise<Language[]> {
    return this.execute(async () => {
      const finded = await this.model.find().exec();

      if (!finded?.length) {
        throw new NotFoundException({
          message: 'Unable to find all languages.',
        });
      }

      return finded;
    });
  }

  async addLanguage(dto: AddLanguageDTO): Promise<Language> {
    return this.execute(async () => {
      const added = await this.model.create(dto);

      if (!added) {
        throw new InternalServerErrorException({
          message: `Failed to create a language for: ${format.base(dto)}`,
        });
      }

      return added.save();
    });
  }

  async editLanguage(
    { id }: LanguageFilter,
    dto: EditLanguageDTO,
  ): Promise<Language> {
    return this.execute(async () => {
      const edited = await this.model.findOneAndUpdate({ _id: id }, dto, {
        new: true,
      });

      if (!edited) {
        throw new NotFoundException({
          message: `Unable to find a language for: ${id}`,
        });
      }

      return edited.save();
    });
  }

  async removeLanguage({ id }: LanguageFilter): Promise<void> {
    return this.execute(async () => {
      const deleted = await this.model.deleteOne({ _id: id });

      if (deleted.deletedCount < 1) {
        throw new NotFoundException({
          message: `Failed to delete a language for: ${id}`,
        });
      }
    });
  }
}
