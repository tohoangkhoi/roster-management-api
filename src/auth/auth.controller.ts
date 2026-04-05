import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { LoginDTO } from './dto/login.dto';
import { AuthService } from './auth.service';
import { Public } from 'src/decorators/public-routes.decorator';
import { omit } from 'lodash';
import type { CustomResquest } from 'src/constants';
import type { UserResponse } from 'src/user/constants/user.constants';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() body: LoginDTO) {
    return this.authService.login(body);
  }

  @Get('profile')
  getProfile(@Request() req: CustomResquest): UserResponse {
    return omit(req.user, ['password']);
  }
}
