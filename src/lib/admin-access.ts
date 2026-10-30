/**
 * Access rules for the local-only admin panel.
 *
 * The panel writes to `data/*.json` and `public/uploads`, and that content is
 * baked into the production build. It must therefore stay unreachable on any
 * deployed host, and the decision must never depend on a value the client can
 * forge.
 *
 * Pure functions on purpose: middleware runs on the edge runtime and these are
 * verified directly with `tsx` (the repo has no test runner).
 */

export const DEFAULT_ADMIN_HOSTS = [
  'localhost:9002',
  '127.0.0.1:9002',
  'localhost:3000',
  '127.0.0.1:3000',
];

/**
 * Parses a comma-separated `ADMIN_ALLOWED_HOSTS` value.
 *
 * Hosts include the port: `localhost:9002` and `localhost` are different
 * entries, so a request to an unexpected port never matches.
 */
export function parseAdminHosts(raw: string | undefined): string[] {
  const value = raw && raw.trim().length > 0 ? raw : DEFAULT_ADMIN_HOSTS.join(',');
  return value
    .split(',')
    .map((host) => host.trim().toLowerCase())
    .filter((host) => host.length > 0);
}

/**
 * Exact, case-insensitive host match. Never substring matching: a check like
 * `host.includes('localhost')` accepts `x-localhost.attacker.tld`.
 */
export function isAdminHostAllowed(
  host: string | null | undefined,
  allowlist: string[]
): boolean {
  if (!host) return false;
  const candidate = host.trim().toLowerCase();
  if (candidate.length === 0) return false;
  return allowlist.includes(candidate);
}

/**
 * Fail-closed production gate. Development stays open so the local authoring
 * workflow is unchanged; production requires BOTH the server-side flag and an
 * allowlisted host.
 */
export function isAdminAccessAllowed(input: {
  isProduction: boolean;
  adminFlag: string | undefined;
  host: string | null | undefined;
  allowlist: string[];
}): boolean {
  if (!input.isProduction) return true;
  if (input.adminFlag !== 'true') return false;
  return isAdminHostAllowed(input.host, input.allowlist);
}

/**
 * True when the request did not arrive over HTTPS, according to the proxy
 * header when present.
 */
export function isInsecureRequest(input: {
  forwardedProto: string | null | undefined;
  urlProtocol: string;
}): boolean {
  const forwarded = input.forwardedProto?.split(',')[0]?.trim().toLowerCase();
  const protocol = (forwarded || input.urlProtocol || '').replace(':', '').toLowerCase();
  return protocol === 'http';
}
