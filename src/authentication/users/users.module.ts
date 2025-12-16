import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypedConfigService } from 'src/configs/type-service.config';
import { AuthConfig } from 'src/configs/auth.config';
import { StringValue } from 'ms';
import { UsersService } from './users.service';
import { HashService } from 'src/authentication/hash/hash.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: TypedConfigService): JwtModuleOptions => ({
        secret: configService.get<AuthConfig>('auth')?.jwt.secret as string,
        signOptions: {
          expiresIn: configService.get<AuthConfig>('auth')?.jwt
            .expiresIn as StringValue,
        },
      }),
    }),
  ],
  providers: [UsersService, HashService],
  //   providers: [{ provide: TypedConfigService, useExisting: ConfigService }],
})
export class UsersModule {}
