export const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const cacheStore = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000;

setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cacheStore) {
    if (now - value.timestamp > CACHE_TTL) {
      cacheStore.delete(key);
    }
  }
}, 60 * 60 * 1000);

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

export function error(message: string, status = 400, details?: Record<string, unknown>): Response {
  const errorResponse: Record<string, unknown> = {
    error: {
      code: `ERR_${status}`,
      message,
      timestamp: new Date().toISOString()
    }
  };

  if (details) {
    (errorResponse.error as Record<string, unknown>).details = details;
  }

  return json(errorResponse, status);
}

export function rateLimited(message = "Too many requests", retryAfter = 60): Response {
  return new Response(JSON.stringify({
    error: {
      code: "ERR_429",
      message,
      timestamp: new Date().toISOString(),
      details: {
        retryAfter,
        resetAt: new Date(Date.now() + retryAfter * 1000).toISOString()
      }
    }
  }), {
    status: 429,
    headers: {
      "Content-Type": "application/json",
      "Retry-After": String(retryAfter),
      "X-RateLimit-Limit": "100",
      "X-RateLimit-Remaining": "0",
      "X-RateLimit-Reset": String(Math.floor((Date.now() + retryAfter * 1000) / 1000)),
      ...corsHeaders
    }
  });
}

export function streamingResponse(stream: ReadableStream, contentType = "application/json"): Response {
  return new Response(stream, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "no-cache",
      "Transfer-Encoding": "chunked",
      ...corsHeaders
    }
  });
}

export function cached(data: unknown, cacheKey: string, maxAge = 3600): Response {
  cacheStore.set(cacheKey, {
    data: JSON.parse(JSON.stringify(data)),
    timestamp: Date.now()
  });

  const cacheControl = [
    `public`,
    `max-age=${maxAge}`,
    `stale-while-revalidate=${maxAge * 2}`,
    `stale-if-error=${maxAge * 3}`
  ].join(", ");

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": cacheControl,
      "CDN-Cache-Control": `public, max-age=${maxAge}`,
      "Vary": "Accept-Encoding",
      "ETag": `"${Buffer.from(cacheKey).toString("base64").slice(0, 16)}"`,
      ...corsHeaders
    }
  });
}

export function getCached(key: string): unknown | null {
  const entry = cacheStore.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cacheStore.delete(key);
    return null;
  }
  return entry.data;
}

export function clearCache(key?: string): void {
  if (key) {
    cacheStore.delete(key);
  } else {
    cacheStore.clear();
  }
}

export function streamingJson<T>(dataGenerator: AsyncGenerator<T>): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of dataGenerator) {
          const json = JSON.stringify(chunk);
          controller.enqueue(encoder.encode(json + "\n"));
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    }
  });

  return streamingResponse(stream, "application/x-ndjson");
  }
