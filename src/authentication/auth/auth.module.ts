import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypedConfigService } from 'src/configs/type-service.config';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { HashService } from '../hash/hash.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User]), UsersModule],
  providers: [
    AuthService,
    UsersService,
    JwtService,
    HashService,
    AuthGuard,
    { provide: TypedConfigService, useExisting: ConfigService },
  ],
  controllers: [AuthController],
  exports: [AuthGuard],
})
export class AuthModule {}
