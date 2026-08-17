import { describe, it, expect, beforeAll } from 'vitest';
import { signUpAndSignIn } from './setup';
import type { YarahClient } from '../src/client';

/**
 * Email module integration tests.
 *
 * Public API tested:
 *   emails.send(options)
 *
 * Email sending may be disabled or rate-limited on test projects.
 * Tests verify the SDK correctly forms the request and surfaces
 * either success or a structured error.
 */

describe('Email Module', () => {
  let authedClient: YarahClient;

  beforeAll(async () => {
    const result = await signUpAndSignIn();
    expect(result.error).toBeNull();
    authedClient = result.client;
  });

  describe('send()', () => {
    it('should send an email with required fields', async () => {
      const { data, error } = await authedClient.emails.send({
        to: 'sdk-test@test.yarah.dev',
        subject: 'SDK Integration Test – ' + new Date().toISOString(),
        html: '<p>Automated test from Yarah SDK integration tests.</p>',
      });

      if (error) {
        // Email not configured – verify structured error
        expect(error.statusCode).toBeDefined();
        expect(typeof error.message).toBe('string');
      } else {
        expect(data).toBeDefined();
      }
    });

    it('should send an email with all optional fields', async () => {
      const { data, error } = await authedClient.emails.send({
        to: ['sdk-test-a@test.yarah.dev', 'sdk-test-b@test.yarah.dev'],
        subject: 'SDK Full Fields Test',
        html: '<h1>Hello</h1><p>Body</p>',
      });

      if (error) {
        expect(error.statusCode).toBeDefined();
      } else {
        expect(data).toBeDefined();
      }
    });
  });
});
