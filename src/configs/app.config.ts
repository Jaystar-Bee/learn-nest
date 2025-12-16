import { registerAs } from '@nestjs/config';

export interface AppConfig {
  appName: string;
}

export const appConfig = registerAs(
  'app',
  (): AppConfig => ({
    appName: process.env.APP_NAME || 'Jay',
  }),
);
