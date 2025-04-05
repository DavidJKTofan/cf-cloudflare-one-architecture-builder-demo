// Cloudflare Worker script to render a Mermaid diagram (ES Module format)

export default {
	async fetch(request, env, ctx) {
		return await handleRequest(request, env);
	},
};

async function handleRequest(request, env) {
	// Add basic security headers
	const responseHeaders = {
		'Cache-Control': 'public, max-age=3600',
		'Content-Security-Policy':
			"default-src 'self'; script-src 'self' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com 'unsafe-inline'; style-src 'self' https://cdnjs.cloudflare.com 'unsafe-inline'; img-src 'self' data:;",
		'X-Content-Type-Options': 'nosniff',
		'X-Frame-Options': 'DENY',
		'Referrer-Policy': 'strict-origin-when-cross-origin',
	};

	// Handle different HTTP methods
	if (request.method !== 'GET') {
		return new Response('Method not allowed', {
			status: 405,
			headers: responseHeaders,
		});
	}

	// Serve static assets using the ASSETS binding
	try {
		let response = await env.ASSETS.fetch(request);

		// Add our security headers to the response
		response = new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers: { ...response.headers, ...responseHeaders },
		});

		return response;
	} catch (e) {
		return new Response('Not found', { status: 404 });
	}
}
