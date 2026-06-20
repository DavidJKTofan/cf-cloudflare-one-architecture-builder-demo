import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src';

describe('Cloudflare One Architecture Builder worker', () => {
	it('serves the SPA shell with security headers (unit style)', async () => {
		const request = new Request('http://example.com');
		// Create an empty context to pass to `worker.fetch()`.
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		// Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
		await waitOnExecutionContext(ctx);
		const body = await response.text();

		expect(response.status).toBe(200);
		expect(response.headers.get('X-Frame-Options')).toContain('DENY');
		expect(body).toContain('Cloudflare One Architecture Builder');
		expect(body).toContain('Private Origin Routing');
	});

	it('serves the SPA shell through SELF (integration style)', async () => {
		const response = await SELF.fetch('http://example.com');
		const body = await response.text();

		expect(response.status).toBe(200);
		expect(body).toContain('Cloudflare One Architecture Builder');
	});
});
