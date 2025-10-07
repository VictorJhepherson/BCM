import {
  ITranslationRepository,
  TranslationEntity,
} from '@/modules/translations/models';
import { BaseRepository } from '@/shared/core';
import { IQueryOptions } from '@/shared/models';
import { LoggerProvider } from '@/shared/providers';

import {
  ITranslationEntity,
  ITranslationFilter,
  ITranslationFilterPG,
  IUTranslationFilter,
  TBody,
  TFlatTranslation,
  TQuery,
  TTranslation,
  TWithPagination,
} from '@bcm/models';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult, Model, UpdateResult } from 'mongoose';

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
  }: TQuery<IUTranslationFilter>): Promise<TFlatTranslation | null> {
    return this.run({
      fn: () => this.model.findOne(filter).lean<TFlatTranslation>().exec(),
    });
  }

  async findMany({
    filter,
  }: TQuery<ITranslationFilterPG>): Promise<TWithPagination<TFlatTranslation>> {
    const { sort, pagination, ...filters } = filter;

    return this.run({
      fn: async () => {
        const [total, data] = await Promise.all([
          this.model.countDocuments(filters).exec(),
          this.model
            .find(filters)
            .sort({ [sort.by]: sort.order === 'ASC' ? 1 : -1 })
            .skip(pagination.skip)
            .limit(pagination.limit)
            .lean<TFlatTranslation[]>()
            .exec(),
        ]);

        return { data, sort, pagination: { ...pagination, total } };
      },
    });
  }

  async createOne({
    payload,
  }: TBody<ITranslationEntity>): Promise<TTranslation> {
    return this.run({
      fn: () => this.model.create(payload),
    });
  }

  async updateOne({
    filter,
    payload,
  }: TQuery<
    IUTranslationFilter,
    Partial<ITranslationEntity>
  >): Promise<TFlatTranslation | null> {
    return this.run({
      fn: () =>
        this.model
          .findOneAndUpdate(filter, payload, { new: true })
          .lean<TFlatTranslation>()
          .exec(),
    });
  }

  async updateMany(
    {
      filter,
      payload,
    }: TQuery<ITranslationFilter, Partial<ITranslationEntity>>,
    { session }: IQueryOptions = {},
  ): Promise<UpdateResult> {
    return this.run({
      fn: () => this.model.updateMany(filter, payload, { session }).exec(),
    });
  }

  async deleteOne({
    filter,
  }: TQuery<IUTranslationFilter>): Promise<DeleteResult> {
    return this.run({
      fn: () => this.model.deleteOne(filter).exec(),
    });
  }

  async deleteMany(
    { filter }: TQuery<ITranslationFilter>,
    { session }: IQueryOptions = {},
  ): Promise<DeleteResult> {
    return this.run({
      fn: () => this.model.deleteMany(filter, { session }).exec(),
    });
  }
}
