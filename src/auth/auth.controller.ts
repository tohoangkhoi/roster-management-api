import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  Request,
  Res,
} from '@nestjs/common';
import { LoginDTO } from './dto/login.dto';
import { AuthService } from './auth.service';
import { Public } from 'src/decorators/public-routes.decorator';
import { omit } from 'lodash';
import type { CustomResquest } from 'src/constants';
import type { UserResponse } from 'src/user/constants/user.constants';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private logger: Logger,
  ) {}

  @Public()
  @Post('login')
  async login(
    @Body() body: LoginDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      await this.authService.login(body, res);
      res.send({ ok: true });
    } catch (error) {
      this.logger.error('Failed to login:', error);
      res.send({ message: 'Failed to login' });
    }
  }

  @Get('profile')
  getProfile(@Request() req: CustomResquest): UserResponse {
    return omit(req.user, ['password']);
  }

  @Post('logout')
  async logout(
    @Req() req: CustomResquest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { id: userId } = req.user;
    await this.authService.logout(userId, res);
    res.send({ ok: true });
  }

  @Post('refresh')
  async refreshToken(
    @Req() req: CustomResquest,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.refreshToken(req.user, res);
    res.send({ ok: true });
  }
}
