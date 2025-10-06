import { OperationBuilder } from '@/shared/core/builders';
import { TransformerCollection } from '@/shared/core/builders/mappers/collection/transformer.collection';

import {
  TFilterProps,
  TFWithoutSelect,
  TFWithSelect,
  TMapProps,
  TMapReturn,
} from './mapper.builder.types';

export class MapBuilder<T, M> {
  constructor(
    private readonly mapper: M,
    private readonly parent: OperationBuilder<T>,
    private readonly collection: TransformerCollection<T> = new TransformerCollection<T>(),
  ) {}

  map<K extends keyof M, R = TMapReturn<M, K>>({
    key,
    select,
  }: TMapProps<K, T>): MapBuilder<R, M> {
    const mapperFn = this.mapper[key] as Function;
    const transformFn = (value: T) => {
      if (!select) return mapperFn.call(this.mapper, value);

      const original = value[select];
      return { ...value, [select]: mapperFn.call(this.mapper, original) };
    };

    const transformers = this.collection.add<R>(transformFn);
    return new MapBuilder<R, M>(
      this.mapper,
      this.parent as unknown as OperationBuilder<R>,
      transformers as unknown as TransformerCollection<R>,
    );
  }

  filter({ fn }: TFWithoutSelect<T>): MapBuilder<T, M>;
  filter({ fn, select }: TFWithSelect<T>): MapBuilder<T, M>;
  filter({ fn, select }: TFilterProps<T>): MapBuilder<T, M> {
    const transformFn = (value: T) => {
      if (!select) {
        if (!Array.isArray(value)) return value;
        return value.filter(fn);
      }

      const original = value[select];
      if (!Array.isArray(original)) return value;

      return { ...value, [select]: original.filter(fn) };
    };

    const transformers = this.collection.add<T | T[]>(transformFn);
    return new MapBuilder<T, M>(
      this.mapper,
      this.parent,
      transformers as unknown as TransformerCollection<T>,
    );
  }

  async execute(): Promise<T> {
    return await this.parent.execute({
      transformers: this.collection.get(),
    });
  }
}
