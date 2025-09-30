import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '@shared/core';
import {
  FlatLanguage,
  ILanguage,
  ILanguageFilter,
  ILanguageRef,
  ILanguageRepository,
  Language,
  LanguageEntity,
  WithPagination,
} from '@shared/models';
import { ClientSession, DeleteResult, Model } from 'mongoose';
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

  async findOne(ref: ILanguageRef): Promise<FlatLanguage | null> {
    return this.execute({
      fn: () => this.model.findOne(ref).lean<FlatLanguage>().exec(),
    });
  }

  async findMany(
    filter: ILanguageFilter,
  ): Promise<WithPagination<FlatLanguage>> {
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
            .lean<FlatLanguage[]>()
            .exec(),
        ]);

        return { data, sort, pagination: { ...pagination, total } };
      },
    });
  }

  async createOne(payload: ILanguage): Promise<Language> {
    return this.execute({
      fn: () => this.model.create(payload),
    });
  }

  async updateOne(
    ref: ILanguageRef,
    payload: Partial<ILanguage>,
    session?: ClientSession,
  ): Promise<FlatLanguage | null> {
    return this.execute({
      fn: () =>
        this.model
          .findOneAndUpdate(ref, payload, { new: true, session })
          .lean<FlatLanguage>()
          .exec(),
    });
  }

  async deleteOne(
    ref: ILanguageRef,
    session?: ClientSession,
  ): Promise<DeleteResult> {
    return this.execute({
      fn: () => this.model.deleteOne(ref, { session }).exec(),
    });
  }
}
