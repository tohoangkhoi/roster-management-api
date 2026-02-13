import { JwtService } from '@nestjs/jwt';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AUTH_ERROR } from './constants/auth.errors';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators/roles.decorator';
import { IS_PUBLIC_KEY } from 'src/decorators/public-routes.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  private isPublicRoute(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    return isPublic;
  }

  private async hasValidRoles(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get(Roles, context.getHandler());

    if (!roles?.length) {
      return true;
    }
    //TODO: TBC after implement role entity
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private async verifyAndExtractJwtToken(request: Request) {
    try {
      const token = this.extractTokenFromHeader(request);
      if (!token) {
        throw new UnauthorizedException(AUTH_ERROR.INVALID_TOKEN.message);
      }

      const payload = await this.jwtService.verifyAsync(token);
      return payload;
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException(AUTH_ERROR.INVALID_TOKEN.message);
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      if (this.isPublicRoute(context)) {
        return true;
      }

      if (!this.hasValidRoles(context)) {
        console.error('Invalid user role');
        return false;
      }
      const request = context.switchToHttp().getRequest();
      const payload = await this.verifyAndExtractJwtToken(request);
      request['user'] = payload;

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
