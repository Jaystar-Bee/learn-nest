import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DummyService } from './dummy/dummy.service';
import { MessageFormatterService } from './message-formatter/message-formatter.service';
import { LoggerService } from './logger/logger.service';
import { TasksModule } from './tasks/tasks.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfig } from './configs/app.config';
import { configValidationSchema } from './configs/config.schema';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/database.config';
import { TypedConfigService } from './configs/type-service.config';
import { authConfig } from './configs/auth.config';
import { UsersModule } from './authentication/users/users.module';
import { HashService } from './authentication/hash/hash.service';
import { AuthModule } from './authentication/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (
        configService: TypedConfigService,
      ): TypeOrmModuleOptions => ({
        ...configService.get('database'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, typeOrmConfig, authConfig],
      validationSchema: configValidationSchema,
      validationOptions: {
        abortEarly: true,
      },
    }),
    TasksModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    DummyService,
    MessageFormatterService,
    LoggerService,
    { provide: TypedConfigService, useExisting: ConfigService },
    HashService,
  ],
})
export class AppModule {}
