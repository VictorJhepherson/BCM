type OthersType = Record<string, any>;

type MockProps<Key extends string, T, O extends OthersType = never> = {
  [K in Key]: T;
} & { others: O };

type MockKind =
  | 'pipe'
  | 'guard'
  | 'mapper'
  | 'service'
  | 'provider'
  | 'strategy'
  | 'controller'
  | 'repository'
  | 'middleware';

export type MockPropsOf<
  K extends MockKind,
  T,
  O extends OthersType = never,
> = MockProps<K, T, O>;
