import { DynamicModule, Module, Provider } from '@nestjs/common';
import { NestBetterAuthService } from './nest-better-auth.service';
import { BETTER_AUTH_OPTIONS } from './nest-better-auth.constants';
import { BetterAuthController } from './nest-better-auth.controller';
import type { BetterAuthOptions } from 'better-auth';

export interface NestBetterAuthModuleOptions {
  config: BetterAuthOptions;
}

@Module({})
export class NestBetterAuthModule {
  static forRoot(options: NestBetterAuthModuleOptions): DynamicModule {
    const configProvider: Provider = {
      provide: BETTER_AUTH_OPTIONS,
      useValue: options.config,
    };

    return {
      module: NestBetterAuthModule,
      providers: [configProvider, NestBetterAuthService],
      controllers: [BetterAuthController],
      exports: [NestBetterAuthService],
      global: true,
    };
  }

  static forRootAsync(options: {
    useFactory: (...args: any[]) => Promise<BetterAuthOptions> | BetterAuthOptions;
    inject?: any[];
  }): DynamicModule {
    const configProvider: Provider = {
      provide: BETTER_AUTH_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };

    return {
      module: NestBetterAuthModule,
      providers: [configProvider, NestBetterAuthService],
      controllers: [BetterAuthController],
      exports: [NestBetterAuthService],
      global: true,
    };
  }
}
