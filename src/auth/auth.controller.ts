import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { LoginDTO } from './dto/login.dto';
import { AuthService } from './auth.service';
import { Public } from 'src/decorators/public-routes.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() body: LoginDTO) {
    return this.authService.login(body);
  }

  @Get('profile')
  async getProfile(@Request() req) {
    return req.user;
  }
}
