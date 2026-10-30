/**
 * Minimal in-memory rate limiter.
 *
 * Scope and limits, stated openly:
 * - State lives in one process. Multiple instances do not share counters, and a
 *   restart clears them.
 * - It is a speed bump for abuse, not an accounting system. Anything that needs
 *   strict enforcement belongs in the platform or a shared store.
 *
 * Kept pure and injectable (`now`) so it can be verified without a test runner.
 */

export interface RateLimitDecision {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export interface RateLimiter {
  check(key: string, now?: number): RateLimitDecision;
  reset(): void;
}

export function createRateLimiter(options: { limit: number; windowMs: number }): RateLimiter {
  const hits = new Map<string, number[]>();

  return {
    check(key: string, now: number = Date.now()): RateLimitDecision {
      const windowStart = now - options.windowMs;
      const previous = hits.get(key) ?? [];
      const recent = previous.filter((timestamp) => timestamp > windowStart);

      if (recent.length >= options.limit) {
        const oldest = recent[0];
        const retryAfterSeconds = Math.max(1, Math.ceil((oldest + options.windowMs - now) / 1000));
        hits.set(key, recent);
        return { allowed: false, remaining: 0, retryAfterSeconds };
      }

      recent.push(now);
      hits.set(key, recent);

      if (hits.size > 5000) {
        // Bound memory: drop entries whose whole window has expired.
        for (const [entryKey, timestamps] of hits) {
          if (!timestamps.some((timestamp) => timestamp > windowStart)) {
            hits.delete(entryKey);
          }
        }
      }

      return {
        allowed: true,
        remaining: options.limit - recent.length,
        retryAfterSeconds: 0,
      };
    },
    reset(): void {
      hits.clear();
    },
  };
}

/**
 * Extracts the client address from proxy headers.
 *
 * The rightmost `x-forwarded-for` entry is used because each proxy appends the
 * peer it saw; with exactly one trusted proxy in front, that value is the real
 * client. A client-supplied prefix cannot override it.
 */
export function clientIpFromHeaders(headers: {
  get(name: string): string | null;
}): string | null {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    const entries = forwarded
      .split(',')
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0);
    if (entries.length > 0) {
      return entries[entries.length - 1];
    }
  }

  const realIp = headers.get('x-real-ip');
  if (realIp && realIp.trim().length > 0) {
    return realIp.trim();
  }

  return null;
}
