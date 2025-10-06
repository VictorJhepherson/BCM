export interface ILoggerProvider {
  info<T>(referrer: string, options: T): void;
  warn<T>(referrer: string, options: T): void;
  error<T>(referrer: string, options: T): void;
  debug<T>(referrer: string, options: T): void;
}
