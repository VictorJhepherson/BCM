import { Reflector } from '@nestjs/core';
import { Scopes, SCOPES_KEY } from './scopes.decorator';

class TestDecorator {
  @Scopes(['PROJECTS', 'TRANSLATIONS'])
  run() {}
}

describe('[decorators] - @Scopes', () => {
  const reflector = new Reflector();

  it('should set correct metadata', () => {
    const metadata = reflector.get<string[]>(
      SCOPES_KEY,
      TestDecorator.prototype.run,
    );

    expect(metadata).toEqual(['PROJECTS', 'TRANSLATIONS']);
  });
});
