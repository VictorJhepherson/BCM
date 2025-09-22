import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  MongooseHealthIndicator,
} from '@nestjs/terminus';

@Controller('/health')
export class HealthController {
  constructor(
    private readonly service: HealthCheckService,
    private readonly mongo: MongooseHealthIndicator,
  ) {}

  @Get('/')
  @HealthCheck()
  async check() {
    return this.service.check([
      async () => this.mongo.pingCheck('mongo', { timeout: 3000 }),
    ]);
  }
}
