import {
  BadRequestException,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { USER_REPOSITORY } from './constants';
import { FindOneOptions, Repository } from 'typeorm';
import { User } from './user.entity';
import { RegisterUserDTO } from './dto/createUser.dto';
import { USER_EXEPTION } from 'src/constants/errors/user';

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

  async registerUser(body: RegisterUserDTO): Promise<User> {
    const { email } = body || {};
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException(USER_EXEPTION.DUPLICATED_USER.message);
    }

    const user = this.userRepository.create(body);
    return this.userRepository.save(user);
  }
}
