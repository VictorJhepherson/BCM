type Arg<F> = F extends (arg: infer A) => any ? A : never;
type Ret<F> = F extends (arg: any) => infer R ? R : never;

export type MapProps<M, K extends keyof M> = {
  key: K;
  data: Arg<M[K]>;
};

export type MapReturn<M, K extends keyof M> = Ret<M[K]>;

export type Mappers<T> = {
  [K in keyof T]: T[K] extends (arg: infer A) => infer R
    ? (arg: A) => R
    : never;
};
