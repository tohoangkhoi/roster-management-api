import { BadRequestException, Injectable } from '@nestjs/common';
import { USER_EXEPTION } from 'src/constants/errors/user';
import { LoginDTO } from 'src/auth/dto/login.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(body: LoginDTO): Promise<{ accessToken: string }> {
    const { email, password } = body || {};
    const user = await this.userService.findOne({ email });

    if (!user) {
      throw new BadRequestException({
        error: USER_EXEPTION.USER_NOT_FOUND.message,
        detail: { email },
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new BadRequestException({
        error: USER_EXEPTION.INVALID_PASSWORD.message,
      });
    }

    const payload = { sub: user.id, email: user.email };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
