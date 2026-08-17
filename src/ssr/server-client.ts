import { YarahClient } from '../client';
import type { YarahConfig } from '../types';
import {
  getAccessTokenCookieName,
  getCookieValue,
  type AuthCookieSettings,
  type CookieStore,
} from './cookies';

export interface CreateServerClientOptions
  extends
    Omit<YarahConfig, 'accessToken' | 'edgeFunctionToken' | 'isServerMode' | 'auth'>,
    AuthCookieSettings {
  cookies?: Pick<CookieStore, 'get'>;
  accessToken?: string;
}

export function createServerClient(options: CreateServerClientOptions = {}): YarahClient {
  let { baseUrl, anonKey } = options;
  try {
    baseUrl ||= process.env.NEXT_PUBLIC_YARAH_URL;
    anonKey ||= process.env.NEXT_PUBLIC_YARAH_ANON_KEY;
  } catch {
    // process may be unavailable outside Next.js/browser-bundled envs.
  }
  if (!baseUrl || !anonKey) {
    throw new Error(
      'Missing Yarah baseUrl or anonKey. Pass baseUrl and anonKey to createServerClient() or set NEXT_PUBLIC_YARAH_URL and NEXT_PUBLIC_YARAH_ANON_KEY.'
    );
  }

  const accessToken =
    options.accessToken ?? getCookieValue(options.cookies, getAccessTokenCookieName(options.names));

  return new YarahClient({
    ...options,
    baseUrl,
    anonKey,
    isServerMode: true,
    accessToken: accessToken ?? undefined,
    // The cookie/option token is the only credential source here; shadow any
    // untyped edgeFunctionToken smuggled through the options spread.
    edgeFunctionToken: undefined,
  });
}
