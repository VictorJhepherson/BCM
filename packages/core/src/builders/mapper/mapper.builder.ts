import { MapReturn, Transform } from '@shared/models';
import { ExecutorBuilder } from '../executor.builder';
import { MapperProps } from './mapper.builder.types';

export class MapBuilder<T, M> {
  constructor(
    private readonly mapper: M,
    private readonly parent: ExecutorBuilder<T>,
    private readonly transformers: Transform[] = [],
  ) {}

  async build(): Promise<T> {
    return await this.parent.build({
      transformers: this.transformers,
    });
  }

  map<K extends keyof M, R = MapReturn<M, K>>({
    key,
  }: MapperProps<K>): MapBuilder<R, M> {
    this.transformers.push((value: T) => {
      const mapperFn = this.mapper[key] as Function;
      return mapperFn(value);
    });

    return new MapBuilder<R, M>(
      this.mapper,
      this.parent as unknown as ExecutorBuilder<R>,
      this.transformers,
    );
  }

  filter(predicate: Transform<T, boolean>): MapBuilder<T, M> {
    this.transformers.push((value: T) => {
      if (!Array.isArray(value)) return value;
      return value.filter(predicate);
    });

    return new MapBuilder<T, M>(this.mapper, this.parent, this.transformers);
  }
}
