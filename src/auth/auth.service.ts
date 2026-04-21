import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { USER_EXEPTION } from 'src/constants/errors/user';
import { LoginDTO } from 'src/auth/dto/login.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { RedisService } from 'src/redis/redis-service.provider';
import { getUserSessionKey } from 'src/utils/redis.utils';
import { User } from 'src/user/user.entity';
import { Response } from 'express';
const THREE_MINUTES = '1800s';
const ONE_DAY = '86400s';
@Injectable()
export class AuthService {
  constructor(
    private redisService: RedisService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async generateUserTokens(user: User) {
    const payload = { sub: user.id };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: THREE_MINUTES,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: ONE_DAY,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async storeUserSessionToCache(
    userId: number,
    accessToken: string,
    refreshToken: string,
  ) {
    await this.redisService.setJson(getUserSessionKey(userId), {
      accessToken,
      refreshToken,
    });
  }

  async login(body: LoginDTO, res: Response) {
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

    const { accessToken, refreshToken } = await this.generateUserTokens(user);
    await this.storeUserSessionToCache(user.id, accessToken, refreshToken);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });
    return { accessToken };
  }

  async clearUserSession(userId: number) {
    await this.redisService.setJson(getUserSessionKey(userId), {});
  }

  async logout(userId: number, res: Response) {
    await this.clearUserSession(userId);
    res.cookie('accesToken', null);
  }

  async refreshToken(user: User, res: Response) {
    //retrieve token from redis cache
    try {
      const userSessionKey = getUserSessionKey(user.id);
      const session = await this.redisService.getJson(userSessionKey);
      const { refreshToken: existingRefreshToken } = session || {};
      if (!existingRefreshToken) {
        throw new UnauthorizedException('Unauthorized: Invalid session');
      }

      let accessToken: string;
      let refreshToken = existingRefreshToken as string;
      try {
        // if refreshToken is still valid, issue a new accessToken
        await this.jwtService.verifyAsync(refreshToken);
        accessToken = await this.jwtService.signAsync(
          { sub: user.id },
          {
            expiresIn: THREE_MINUTES,
          },
        );
      } catch (error) {
        //if refresTOken is already expired, issue a new pair accessToken and refreshToken
        console.error(error);
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          await this.generateUserTokens(user);
        accessToken = newAccessToken;
        refreshToken = newRefreshToken;
      }

      await this.storeUserSessionToCache(user.id, accessToken, refreshToken);

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
      });
    } catch (error) {
      // if there is an existing session, refresh the accessToken
      //throw error and clear user session from cache
      await this.clearUserSession(user.id);
      throw new BadRequestException(error);
    }
  }
}
