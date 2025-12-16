import { ConflictException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { User } from '../users/entities/user.entity';
import { HashService } from '../hash/hash.service';
import { LoginDto } from '../dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
  ) {}

  public async register(createUserDto: CreateUserDto): Promise<User> {
    const userExist = await this.userService.findOneByEmail(
      createUserDto.email,
    );

    if (userExist) {
      throw new ConflictException('Email already exists');
    }

    const user = await this.userService.create(createUserDto);
    delete user?.password;
    return user;
  }

  public async login(login: LoginDto): Promise<string> {
    const userExist = await this.userService.findOneByEmail(login.email);
    if (!userExist) {
      throw new ConflictException('Incorrect email or password');
    }
    const passwordMatch = await this.hashService.compareHash(
      login.password,
      userExist?.password as string,
    );
    if (!passwordMatch) {
      throw new ConflictException('Incorrect email or password');
    }

    return this.generateToken(userExist);
  }

  public async isTokenValid(token: string): Promise<boolean> {
    try {
      await this.jwtService.verify(token);
      return true;
    } catch (_) {
      return false;
    }
  }

  private generateToken(user: User): string {
    const payload = { id: user?.id, email: user.email, name: user?.fullName };
    return this.jwtService.sign(payload);
  }
}
