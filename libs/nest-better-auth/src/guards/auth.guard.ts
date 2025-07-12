import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { NestBetterAuthService } from '../nest-better-auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: NestBetterAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const sessionResponse = await this.authService.getSession(
      request.headers as Record<string, string>,
    );

    const session = (sessionResponse as any)?.data?.session;
    const user = (sessionResponse as any)?.data?.user;

    if (!session) {
      throw new UnauthorizedException('No active session');
    }

    (request as any).session = session;
    (request as any).user = user;

    return true;
  }
} 