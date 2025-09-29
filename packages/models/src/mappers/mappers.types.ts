export type MapArg<F> = F extends (arg: infer A) => any ? A : never;
export type MapRet<F> = F extends (arg: any) => infer R ? R : never;

export type MapProps<M, K extends keyof M> = {
  key: K;
  data: MapArg<M[K]>;
};

export type MapReturn<M, K extends keyof M> = MapRet<M[K]>;
