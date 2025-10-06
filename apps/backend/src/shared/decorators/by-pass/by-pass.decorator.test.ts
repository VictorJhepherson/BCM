import { Reflector } from '@nestjs/core';
import { BY_PASS_KEY, ByPass } from './by-pass.decorator';

class TestDecorator {
  @ByPass()
  run() {}
}

class TestWithoutByPass {
  run() {}
}

describe('[decorators] - @ByPass', () => {
  const reflector = new Reflector();

  it('should set correct metadata', () => {
    const metadata = reflector.get<string[]>(
      BY_PASS_KEY,
      TestDecorator.prototype.run,
    );

    expect(metadata).toEqual(true);
  });

  it('should set correct metadata', () => {
    const metadata = reflector.get<string[]>(
      BY_PASS_KEY,
      TestWithoutByPass.prototype.run,
    );

    expect(metadata).toEqual(undefined);
  });
});
