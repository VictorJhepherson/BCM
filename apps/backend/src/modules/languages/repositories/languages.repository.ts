import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '@shared/core';
import {
  ILanguage,
  ILanguageFilter,
  ILanguageRef,
  ILanguageRepository,
  Language,
  LanguageEntity,
  WithPagination,
} from '@shared/models';
import { DeleteResult, Model } from 'mongoose';
import { LoggerProvider } from '../../../providers';

@Injectable()
export class LanguageRepository
  extends BaseRepository
  implements ILanguageRepository
{
  constructor(
    logger: LoggerProvider,
    @InjectModel(LanguageEntity.name)
    private readonly model: Model<LanguageEntity>,
  ) {
    super('[languages]', logger);
  }

  async findMany(filter: ILanguageFilter): Promise<WithPagination<Language>> {
    const { sort, pagination } = filter;

    return this.execute({
      fn: async () => {
        const [total, data] = await Promise.all([
          this.model.countDocuments().exec(),
          this.model
            .find()
            .sort({ [sort.by]: sort.order === 'ASC' ? 1 : -1 })
            .skip(pagination.skip)
            .limit(pagination.limit)
            .exec(),
        ]);

        return { data, sort, pagination: { ...pagination, total } };
      },
    });
  }

  async create(payload: ILanguage): Promise<Language> {
    return this.execute({
      fn: () => this.model.create(payload),
    });
  }

  async update(
    ref: ILanguageRef,
    payload: Partial<ILanguage>,
  ): Promise<Language | null> {
    return this.execute({
      fn: () => this.model.findOneAndUpdate(ref, payload, { new: true }).exec(),
    });
  }

  async deleteOne(ref: ILanguageRef): Promise<DeleteResult> {
    return this.execute({
      fn: () => this.model.deleteOne(ref).exec(),
    });
  }
}
