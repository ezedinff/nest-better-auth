import { Inject, Injectable } from '@nestjs/common';
import { betterAuth } from 'better-auth';
import { BETTER_AUTH_OPTIONS } from './nest-better-auth.constants';
import type { BetterAuthOptions } from 'better-auth';

@Injectable()
export class NestBetterAuthService {
  private readonly authInstance: ReturnType<typeof betterAuth>;

  constructor(
    @Inject(BETTER_AUTH_OPTIONS) private readonly options: BetterAuthOptions,
  ) {
    this.authInstance = betterAuth(this.options);
  }

  // underlying Better Auth instance
  get auth() {
    return this.authInstance;
  }

  // Handle incoming Request (Express or Fetch)
  async handleRequest(req: Request | any): Promise<Response> {
    // Convert Express Request to Web Request if needed
    if ((req as any).headers && !(req instanceof Request)) {
      const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

      const init: RequestInit = {
        method: req.method,
        headers: req.headers as any,
        body: ['GET', 'HEAD'].includes(req.method) ? undefined : req.body,
      } as RequestInit;

      return this.authInstance.handler(new Request(url, init));
    }

    // Already a Fetch API Request
    return this.authInstance.handler(req as Request);
  }

  // Session helpers
  async getSession(headers: Record<string, string | string[]>): Promise<any> {
    return this.authInstance.api.getSession({ headers } as any);
  }

  async signOut(headers: Record<string, string | string[]>): Promise<any> {
    return this.authInstance.api.signOut({ headers } as any);
  }
}
