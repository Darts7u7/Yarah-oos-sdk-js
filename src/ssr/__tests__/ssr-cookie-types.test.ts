import { describe, expectTypeOf, it } from 'vitest';
import { updateSession, type CookieStore, type UpdateSessionResult } from '../middleware';

/**
 * Type-only tests pinning `CookieStore` compatibility with the cookie stores
 * exposed by `NextRequest.cookies` and `NextResponse.cookies`.
 *
 * The declarations below mirror the public surface of
 * `next/dist/compiled/@edge-runtime/cookies` as shipped by both next@14 and
 * next@15, so the documented middleware snippet keeps compiling without
 * adding a dependency on `next`.
 */

interface NextRequestCookie {
  name: string;
  value: string;
}

interface NextResponseCookie {
  name: string;
  value: string;
  domain?: string;
  expires?: number | Date;
  httpOnly?: boolean;
  maxAge?: number;
  partitioned?: boolean;
  path?: string;
  priority?: 'low' | 'medium' | 'high';
  sameSite?: 'strict' | 'lax' | 'none' | boolean;
  secure?: boolean;
}

declare class NextRequestCookies {
  get size(): number;
  get(...args: [name: string] | [NextRequestCookie]): NextRequestCookie | undefined;
  getAll(...args: [name: string] | [NextRequestCookie] | []): NextRequestCookie[];
  has(name: string): boolean;
  set(...args: [key: string, value: string] | [options: NextRequestCookie]): this;
  delete(names: string | string[]): boolean | boolean[];
  clear(): this;
  toString(): string;
}

declare class NextResponseCookies {
  get(...args: [key: string] | [options: NextResponseCookie]): NextResponseCookie | undefined;
  getAll(...args: [key: string] | [options: NextResponseCookie] | []): NextResponseCookie[];
  has(name: string): boolean;
  set(
    ...args:
      | [key: string, value: string, cookie?: Partial<NextResponseCookie>]
      | [options: NextResponseCookie]
  ): this;
  delete(...args: [key: string] | [options: Omit<NextResponseCookie, 'value' | 'expires'>]): this;
  toString(): string;
}

describe('@insforge/sdk/ssr cookie store types', () => {
  it('accepts NextRequest and NextResponse cookie stores as CookieStore', () => {
    expectTypeOf<NextRequestCookies>().toMatchTypeOf<CookieStore>();
    expectTypeOf<NextResponseCookies>().toMatchTypeOf<CookieStore>();
  });

  it('compiles the documented updateSession middleware snippet', () => {
    const middleware = (
      request: { cookies: NextRequestCookies },
      response: { cookies: NextResponseCookies }
    ) =>
      updateSession({
        requestCookies: request.cookies,
        responseCookies: response.cookies,
      });

    expectTypeOf(middleware).returns.toEqualTypeOf<Promise<UpdateSessionResult>>();
  });
});
