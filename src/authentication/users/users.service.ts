import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashService } from 'src/authentication/hash/hash.service';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashService: HashService,
  ) {}

  public async create(user: CreateUserDto): Promise<User> {
    user.password = await this.hashService.hashText(user.password);
    const createdUser = this.userRepository.create(user);
    return await this.userRepository.save(createdUser);
  }

  public async findOneByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ email });
  }

  public async findOneById(id: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ id });
  }
}
