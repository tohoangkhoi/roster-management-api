import { JwtService } from '@nestjs/jwt';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AUTH_ERROR } from './constants/auth.errors';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators/roles.decorator';
import { IS_PUBLIC_KEY } from 'src/decorators/public-routes.decorator';
import { JwtTokenPayload } from './constants/auth.tokens';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
import { RoleValue } from 'src/user-roles/constants/user-roles-providers.constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private userService: UserService,
  ) {}

  private isPublicRoute(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    return isPublic;
  }

  private hasValidRoles(context: ExecutionContext, user: User): boolean {
    const requiredRoles = this.reflector.get<RoleValue[]>(
      Roles,
      context.getHandler(),
    );

    if (!requiredRoles?.length) {
      return true;
    }

    return requiredRoles.some((role) => {
      return user?.userRoles?.map((role) => role.value).includes(role);
    });
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
      const payload = await this.jwtService.verifyAsync<JwtTokenPayload>(token);
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

      const request = context.switchToHttp().getRequest<Request>();
      const { email } = await this.verifyAndExtractJwtToken(request);
      const user = await this.userService.findOne({ email });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND, {
          cause: email,
        });
      }

      if (!this.hasValidRoles(context, user)) {
        throw new UnauthorizedException('Invalid user roles.');
      }
      request['user'] = user;
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
