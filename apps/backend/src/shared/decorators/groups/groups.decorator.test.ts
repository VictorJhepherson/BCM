import { Reflector } from '@nestjs/core';
import { Groups, GROUPS_KEY } from './groups.decorator';

class TestDecorator {
  @Groups(['EDITOR', 'ADMIN'])
  run() {}
}

describe('[decorators] - @Groups', () => {
  const reflector = new Reflector();

  it('should set correct metadata', () => {
    const metadata = reflector.get<string[]>(
      GROUPS_KEY,
      TestDecorator.prototype.run,
    );

    expect(metadata).toEqual(['EDITOR', 'ADMIN']);
  });
});
