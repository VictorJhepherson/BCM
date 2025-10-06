export type TBaseType = Record<string, any>;
export type TMockReplace<R, K extends keyof any, N> = Omit<R, K> & Record<K, N>;
