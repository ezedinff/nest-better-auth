# Nest Better Auth

A small **NestJS wrapper** around [Better Auth](https://www.better-auth.com/docs/introduction) – the framework-agnostic authentication library for TypeScript.

It exposes Better Auth inside a standard Nest module (`NestBetterAuthModule`) and gives you:

* `NestBetterAuthService` – access to the raw Better Auth instance
* `BetterAuthController` – wires **all** `/api/auth/**` routes directly to Better Auth so every core feature & plugin works out-of-the-box
* `AuthGuard`, `@CurrentUser()` & `@CurrentSession()` decorators – simple route protection

---

## Installation

```bash
npm i nest-better-auth better-auth                 # peer dependency
# optional – pick your DB adapter / ORM
npm i drizzle-orm                                   # or prisma / kysely …
```

---

## Quick start

```ts
import { Module } from '@nestjs/common';
import { NestBetterAuthModule } from 'nest-better-auth';
import Database from 'better-sqlite3';
import { twoFactor } from 'better-auth/plugins';

@Module({
  imports: [
    NestBetterAuthModule.forRoot({
      config: {
        database: new Database('./auth.db'),
        emailAndPassword: { enabled: true },
        plugins: [twoFactor()],
      },
    }),
  ],
})
export class AppModule {}
```

Every request to `/api/auth/**` is now handled by Better Auth. To protect a route:

```ts
@Get('profile')
@UseGuards(AuthGuard)
getProfile(@CurrentUser() user) {
  return user;
}
```

---

## Using Better Auth plugins

Plugins simply go into the `plugins` array above. They work exactly as documented because the Nest layer never interferes with Better Auth’s internals.

If the plugin ships a DB schema run:

```bash
npx @better-auth/cli migrate           # or `generate` if you prefer SQL files
```

Add the matching client plugin on the frontend (React example):

```ts
import { createAuthClient } from 'better-auth/react';
import { twoFactorClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  plugins: [twoFactorClient({ twoFactorPage: '/2fa' })],
});
```

---

## Protecting routes

To secure endpoints, import the helpers directly from this package:

```ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  AuthGuard,
  CurrentUser,
  CurrentSession,
} from 'nest-better-auth';

@Controller('profile')
export class ProfileController {
  // Guard verifies the user has a valid Better-Auth session
  @Get()
  @UseGuards(AuthGuard)
  getProfile(
    @CurrentUser() user: any,
    @CurrentSession() session: any,
  ) {
    return { user, session };
  }
}
```

`AuthGuard` calls `auth.api.getSession()` under the hood and populates `request.user` and `request.session` so they’re available to the `@CurrentUser()` and `@CurrentSession()` param decorators.


## License

This project is licensed under the [MIT license](LICENSE).

© 2025 Ezedin
