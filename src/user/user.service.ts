import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from './constants';
import { FindOneOptions, Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDTO } from './dto/createUser.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: Repository<User>,
  ) {}

  async findAll(
    start: number,
    limit: number,
  ): Promise<{ users: User[]; total: number }> {
    const [users, total] = await this.userRepository.findAndCount({
      skip: start,
      take: limit,
    });
    return { users, total };
  }

  async findOne(where: FindOneOptions<User>): Promise<User> {
    if (!where) {
      throw new Error('Missing where parameters');
    }

    const user = await this.userRepository.findOne(where);
    if (!user) {
      throw new Error('User does not exist');
    }

    return user;
  }

  async creatUser(body: CreateUserDTO): Promise<User> {
    const user = this.userRepository.create(body);
    return this.userRepository.save(user);
  }
}
