import { TGenericFn } from '@bcm/models';

export class TransformerCollection<T, A = T> {
  private readonly transformers: TGenericFn<T, A>[] = [];

  constructor(transformers: TGenericFn<any, any>[] = []) {
    this.transformers = transformers;
  }

  add<N>(fn: TGenericFn<N, A>): TransformerCollection<N, A> {
    return new TransformerCollection<N, A>([...this.transformers, fn]);
  }

  get(): TGenericFn<T, A>[] {
    return this.transformers;
  }
}
