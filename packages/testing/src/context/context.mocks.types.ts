type OthersType = Record<string, any>;

export type ControllerMockProps<C, S, P extends OthersType = never> = {
  service: S;
  providers: P;
  controller: C;
};

export type MapperMockProps<M> = {
  mapper: M;
};

export type RepositoryMockProps<R, M> = {
  repository: R;
  model: M;
};

export type ServiceMockProps<S, R> = {
  service: S;
  repository: R;
};

export type LoggerMockProps<P, C> = {
  provider: P;
  config: C;
};

export type PipeMockProps<P> = {
  pipe: P;
};

export type MiddlewareMockProps<M, S extends OthersType = never> = {
  middleware: M;
  services: S;
};

export type GuardMockProps<G, S extends OthersType = never> = {
  guard: G;
  services: S;
};
