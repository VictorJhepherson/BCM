export class TestLogger {
  info = jest.fn();
  warn = jest.fn();
  error = jest.fn();
  debug = jest.fn();
}

export class TestMapper {
  mapTest(data: Record<string, string>): string {
    return Object.values(data)[0] || '';
  }
  mapTests(data: Record<string, string>[]): string[] {
    return data.map((item) => this.mapTest(item));
  }
}
