import { All, Controller, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { NestBetterAuthService } from './nest-better-auth.service';

@Controller('api/auth')
export class BetterAuthController {
  constructor(private readonly authService: NestBetterAuthService) {}

  @All('*')
  async handleAuth(@Req() req: Request, @Res() res: Response) {
    const betterAuthResponse = await this.authService.handleRequest(req);
    betterAuthResponse.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'set-cookie') {
        res.setHeader('Set-Cookie', value);
      } else {
        res.setHeader(key, value);
      }
    });
    const bodyBuffer = Buffer.from(await betterAuthResponse.arrayBuffer());
    res.status(betterAuthResponse.status).send(bodyBuffer);
  }
} 