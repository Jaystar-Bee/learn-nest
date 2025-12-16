import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { User } from '../users/entities/user.entity';
import { LoginDto } from '../dtos/login.dto';
import { LoginResponse } from './auth.model';
import type { AuthRequest } from './auth.request';
import { UsersService } from '../users/users.service';
import { AuthGuard } from './auth.guard';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  public async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  public async login(@Body() login: LoginDto): Promise<LoginResponse> {
    const access_token = await this.authService.login(login);
    return { access_token };
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  public async profile(@Request() request: AuthRequest): Promise<User> {
    const user = await this.usersService.findOneById(request.user.id);
    if (user) {
      return user;
    }
    throw new NotFoundException('User not found');
  }
}
