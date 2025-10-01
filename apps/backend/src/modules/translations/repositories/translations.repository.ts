import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '@shared/core';
import {
  FlatTranslation,
  IQueryOptions,
  ITranslation,
  ITranslationFilterPG,
  ITranslationRef,
  ITranslationRepository,
  PopulateTranslation,
  Translation,
  TranslationEntity,
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

  async findOne(ref: ITranslationRef): Promise<PopulateTranslation | null> {
    return this.execute({
      fn: () =>
        this.model
          .findOne(ref)
          .populate({ path: 'language', select: 'name' })
          .lean<PopulateTranslation>()
          .exec(),
    });
  }

  async findMany(
    filter: ITranslationFilterPG,
  ): Promise<WithPagination<PopulateTranslation>> {
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
            .populate({ path: 'language', select: 'name' })
            .lean<PopulateTranslation[]>()
            .exec(),
        ]);

        return { data, sort, pagination: { ...pagination, total } };
      },
    });
  }

  async createOne(payload: ITranslation): Promise<Translation> {
    return this.execute({
      fn: () => this.model.create(payload),
    });
  }

  async updateOne(
    ref: ITranslationRef,
    payload: Partial<ITranslation>,
    { session }: IQueryOptions = {},
  ): Promise<FlatTranslation | null> {
    return this.execute({
      fn: () =>
        this.model
          .findOneAndUpdate(ref, payload, { new: true, session })
          .lean<FlatTranslation>()
          .exec(),
    });
  }

  async updateMany(
    ref: Partial<ITranslationRef>,
    payload: Partial<ITranslation>,
    { session }: IQueryOptions = {},
  ): Promise<UpdateResult> {
    return this.execute({
      fn: () => this.model.updateMany(ref, payload, { session }).exec(),
    });
  }

  async deleteOne(
    ref: ITranslationRef,
    { session }: IQueryOptions = {},
  ): Promise<DeleteResult> {
    return this.execute({
      fn: () => this.model.deleteOne(ref, { session }).exec(),
    });
  }

  async deleteMany(
    ref: Partial<ITranslationRef>,
    { session }: IQueryOptions = {},
  ): Promise<DeleteResult> {
    return this.execute({
      fn: () => this.model.deleteMany(ref, { session }).exec(),
    });
  }
}
