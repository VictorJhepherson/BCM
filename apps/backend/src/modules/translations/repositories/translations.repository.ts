import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '@shared/core';
import {
  FlatTranslation,
  IQueryOptions,
  ITranslation,
  ITranslationFilter,
  ITranslationFilterPG,
  ITranslationRepository,
  TBody,
  TQuery,
  Translation,
  TranslationEntity,
  UFilterTranslation,
  WithPagination,
} from '@shared/models';
import { DeleteResult, Model, UpdateResult } from 'mongoose';
import { LoggerProvider } from '../../../providers';

@Injectable()
export class TranslationRepository
  extends BaseRepository
  implements ITranslationRepository
{
  constructor(
    logger: LoggerProvider,
    @InjectModel(TranslationEntity.name)
    private readonly model: Model<TranslationEntity>,
  ) {
    super('[translations]', logger);
  }

  async findOne({
    filter,
  }: TQuery<UFilterTranslation>): Promise<FlatTranslation | null> {
    return this.execute({
      fn: () => this.model.findOne(filter).lean<FlatTranslation>().exec(),
    });
  }

  async findMany({
    filter,
  }: TQuery<ITranslationFilterPG>): Promise<WithPagination<FlatTranslation>> {
    const { sort, pagination, ...filters } = filter;

    return this.execute({
      fn: async () => {
        const [total, data] = await Promise.all([
          this.model.countDocuments().exec(),
          this.model
            .find(filters)
            .sort({ [sort.by]: sort.order === 'ASC' ? 1 : -1 })
            .skip(pagination.skip)
            .limit(pagination.limit)
            .lean<FlatTranslation[]>()
            .exec(),
        ]);

        return { data, sort, pagination: { ...pagination, total } };
      },
    });
  }

  async createOne({ payload }: TBody<ITranslation>): Promise<Translation> {
    return this.execute({
      fn: () => this.model.create(payload),
    });
  }

  async updateOne(
    { filter, payload }: TQuery<UFilterTranslation, Partial<ITranslation>>,
    { session }: IQueryOptions = {},
  ): Promise<FlatTranslation | null> {
    return this.execute({
      fn: () =>
        this.model
          .findOneAndUpdate(filter, payload, { new: true, session })
          .lean<FlatTranslation>()
          .exec(),
    });
  }

  async updateMany(
    { filter, payload }: TQuery<ITranslationFilter, Partial<ITranslation>>,
    { session }: IQueryOptions = {},
  ): Promise<UpdateResult> {
    return this.execute({
      fn: () => this.model.updateMany(filter, payload, { session }).exec(),
    });
  }

  async deleteOne(
    { filter }: TQuery<UFilterTranslation>,
    { session }: IQueryOptions = {},
  ): Promise<DeleteResult> {
    return this.execute({
      fn: () => this.model.deleteOne(filter, { session }).exec(),
    });
  }

  async deleteMany(
    { filter }: TQuery<ITranslationFilter>,
    { session }: IQueryOptions = {},
  ): Promise<DeleteResult> {
    return this.execute({
      fn: () => this.model.deleteMany(filter, { session }).exec(),
    });
  }
}
