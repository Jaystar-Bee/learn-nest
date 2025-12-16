import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppConfig } from './app.config';
import { AuthConfig } from './auth.config';

export interface ConfigTypes {
  app: AppConfig;
  database: TypeOrmModuleOptions;
  auth: AuthConfig;
}
