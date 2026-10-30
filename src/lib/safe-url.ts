/**
 * URL hardening for user-authored rich text.
 *
 * The serializer emits HTML that is injected with `dangerouslySetInnerHTML`, and
 * the HTML escape routine only neutralizes markup characters. An `href` of
 * `javascript:...` survives that escaping and runs on click, so the scheme has to
 * be validated separately.
 */

const SAFE_PROTOCOLS = new Set(['http:', 'https:', 'mailto:']);

/**
 * Returns the URL when it is safe to place in an `href`, or `null` when it should
 * be dropped. Relative paths and fragments are allowed; protocol-relative URLs
 * (`//host`) are not, because they silently point at another origin.
 */
export function safeHref(rawUrl: string | null | undefined): string | null {
  if (!rawUrl) return null;

  // Browsers ignore tabs and newlines inside a scheme, so drop them before
  // parsing (`java\nscript:` must not become a valid scheme).
  const value = rawUrl.replace(/[\t\r\n]/g, '').trim();
  if (value.length === 0) return null;

  if (value.startsWith('#')) return value;
  if (value.startsWith('//')) return null;
  if (value.startsWith('/')) return value;

  try {
    const parsed = new URL(value);
    return SAFE_PROTOCOLS.has(parsed.protocol.toLowerCase()) ? value : null;
  } catch {
    // Not an absolute URL: treat as a relative path such as `page?x=1`.
    return /^[a-z0-9._~!$&'()*+,;=:@%/?#-]+$/i.test(value) ? value : null;
  }
}
