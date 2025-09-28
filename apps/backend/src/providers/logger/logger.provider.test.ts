import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { Logging, LoggingLevel } from '@shared/models';
import { MockMethodFactory, MockPropsOf } from '@shared/testing';
import { LoggerProvider } from './logger.provider';

const referrer = '[test][logger]';
const response = { welcome: 'Hello World!' };

describe('[providers] - LoggerProvider', () => {
  const context = {} as MockPropsOf<
    'provider',
    LoggerProvider,
    {
      config: ConfigService;
    }
  >;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        LoggerProvider,
        {
          provide: ConfigService,
          useFactory: () =>
            new MockMethodFactory<ConfigService>()
              .add('get', jest.fn())
              .build(),
        },
      ],
    }).compile();

    context.provider = moduleRef.get(LoggerProvider);
    context.others = {
      config: moduleRef.get(ConfigService),
    };
  });

  afterEach(() => jest.clearAllMocks());

  describe('[enabled]', () => {
    beforeEach(() => {
      (context.others.config.get as jest.Mock).mockImplementation(
        (key: string) => {
          if (key === 'LOGGING') return Logging.ENABLED;
          if (key === 'LOGGING_LEVEL') {
            return [
              LoggingLevel.INFO,
              LoggingLevel.WARN,
              LoggingLevel.ERROR,
              LoggingLevel.DEBUG,
            ];
          }

          return undefined;
        },
      );
    });

    it('[info] - should log info', () => {
      const spy = jest.spyOn(console, 'info').mockImplementation();

      context.provider.info(referrer, { response });
      expect(spy).toHaveBeenCalledWith(`[INFO]${referrer}`, expect.any(String));
    });

    it('[warn] - should log warn', () => {
      const spy = jest.spyOn(console, 'warn').mockImplementation();

      context.provider.warn(referrer, { response });
      expect(spy).toHaveBeenCalledWith(`[WARN]${referrer}`, expect.any(String));
    });

    it('[error] - should log error', () => {
      const spy = jest.spyOn(console, 'error').mockImplementation();

      context.provider.error(referrer, { response });
      expect(spy).toHaveBeenCalledWith(
        `[ERROR]${referrer}`,
        expect.any(String),
      );
    });

    it('[debug] - should log debug', () => {
      const spy = jest.spyOn(console, 'debug').mockImplementation();

      context.provider.debug(referrer, { response });
      expect(spy).toHaveBeenCalledWith(
        `[DEBUG]${referrer}`,
        expect.any(String),
      );
    });
  });

  describe('[disabled]', () => {
    beforeEach(() =>
      (context.others.config.get as jest.Mock).mockImplementation(
        (key: string) => {
          if (key === 'LOGGING') return Logging.DISABLED;
          if (key === 'LOGGING_LEVEL') {
            return [
              LoggingLevel.INFO,
              LoggingLevel.WARN,
              LoggingLevel.ERROR,
              LoggingLevel.DEBUG,
            ];
          }

          return undefined;
        },
      ),
    );

    it('[info] - should not log info', () => {
      const spy = jest.spyOn(console, 'info').mockImplementation();

      expect(context.provider.info(referrer, { response }));
      expect(spy).not.toHaveBeenCalled();
    });

    it('[warn] - should not log warn', () => {
      const spy = jest.spyOn(console, 'warn').mockImplementation();

      expect(context.provider.warn(referrer, { response }));
      expect(spy).not.toHaveBeenCalled();
    });

    it('[error] - should not log error', () => {
      const spy = jest.spyOn(console, 'error').mockImplementation();

      expect(context.provider.error(referrer, { response }));
      expect(spy).not.toHaveBeenCalled();
    });

    it('[debug] - should not log debug', () => {
      const spy = jest.spyOn(console, 'debug').mockImplementation();

      expect(context.provider.debug(referrer, { response }));
      expect(spy).not.toHaveBeenCalled();
    });
  });
});
