/**
 * Upload helpers.
 *
 * The stored filename decides how Next.js serves the file from `public/`, so the
 * extension must come from the validated MIME type and never from the client
 * filename. Trusting `path.extname(file.name)` let a file called `x.html` with
 * `type: image/png` be persisted as `.html` and served same-origin as HTML.
 */

import path from 'path';

export const EXTENSION_BY_MIME: Readonly<Record<string, string>> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'application/pdf': '.pdf',
};

/**
 * Returns the only extension allowed for a MIME type, or `null` when the type is
 * unknown. Callers must treat `null` as a rejection.
 */
export function extensionForMime(mimeType: string | null | undefined): string | null {
  if (!mimeType) return null;
  const normalized = mimeType.split(';')[0].trim().toLowerCase();
  if (normalized.length === 0) return null;
  return EXTENSION_BY_MIME[normalized] ?? null;
}

/**
 * Builds a collision-resistant filename whose extension is derived from the MIME
 * type. Returns `null` for an unsupported type instead of guessing.
 */
export function uploadFileName(
  prefix: string,
  mimeType: string | null | undefined,
  now: number = Date.now()
): string | null {
  const extension = extensionForMime(mimeType);
  if (!extension) return null;
  return `${prefix}${now}${extension}`;
}

/**
 * Resolves an `/uploads/...` URL to an absolute path that is guaranteed to sit
 * strictly inside `<publicDir>/uploads`.
 *
 * Admin delete actions used to call `fs.rm(recursive: true)` on a path built
 * straight from the record's URL, so a hand-edited or malformed entry could point
 * outside `public/`. Returns `null` when the path escapes the uploads root.
 */
export function resolveWithinUploads(
  publicDir: string,
  relativeUrl: string | null | undefined
): string | null {
  if (!relativeUrl) return null;

  const normalized = relativeUrl.replace(/^\/+/, '');
  if (!normalized.startsWith('uploads/')) return null;

  const uploadsRoot = path.resolve(publicDir, 'uploads');
  const candidate = path.resolve(publicDir, normalized);

  if (candidate === uploadsRoot) return null;
  if (!candidate.startsWith(uploadsRoot + path.sep)) return null;

  return candidate;
}
