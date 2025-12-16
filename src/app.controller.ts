import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { LoggerService } from './logger/logger.service';
import { AppConfig } from './configs/app.config';
import { TypedConfigService } from './configs/type-service.config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly loggerService: LoggerService,
    private readonly configService: TypedConfigService,
  ) {}

  @Get()
  getHello(): string {
    const appName = this.configService.get<AppConfig>('app')?.appName;
    return this.loggerService.log(`Hello World! ${appName}`);
  }
}
