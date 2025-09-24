export type MapArg<F> = F extends (arg: infer A) => any ? A : never;
export type MapRet<F> = F extends (arg: any) => infer R ? R : never;

export type MapProps<M, K extends keyof M> = {
  key: K;
  data: MapArg<M[K]>;
};

export type MapReturn<M, K extends keyof M> = MapRet<M[K]>;

export type Mappers<T> = {
  [K in keyof T]: T[K] extends (arg: infer A) => infer R
    ? (arg: A) => R
    : never;
};
