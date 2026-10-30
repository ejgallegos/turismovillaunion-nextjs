# security-hardening

Objective: close the findings of the security audit (2026-10-30) on branch `release-2`.
Delivery: `ask-on-risk`. Test runner: none — verification with `npm run typecheck` plus
`tsx` scripts and `curl` probes (no test framework exists in the repo).

## Specs

S1. In production, `/admin*` and `/login*` return 404 unless `ENABLE_ADMIN === 'true'`
    AND the request host is an exact member of the admin host allowlist. Unset
    `ENABLE_ADMIN` means the admin is unreachable regardless of the `Host` header.
    In development the admin stays enabled.
S2. Host matching is exact (case-insensitive, including port). No substring matching.
    Allowlist defaults to `localhost:9002,127.0.0.1:9002,localhost:3000,127.0.0.1:3000`
    and is overridable with `ADMIN_ALLOWED_HOSTS`.
S3. Every uploaded file gets its extension from the validated MIME type, never from
    the client filename. `image/jpeg`→`.jpg`, `image/png`→`.png`, `image/webp`→`.webp`,
    `application/pdf`→`.pdf`. An unknown MIME type is rejected.
S4. `sendContactEmail` is rate limited per client IP and every user-supplied value is
    HTML-escaped in the email body and display name. Each request performs a single
    SMTP operation (no `transporter.verify()`).
S5. Rich-text link URLs are emitted only for `http:`, `https:`, `mailto:` or relative
    paths; anything else (`javascript:`, `data:`, `vbscript:`) renders no link.
S6. Admin delete operations never remove a directory outside `public/uploads/`.
S7. Responses carry `Strict-Transport-Security` in production; the CSP drops
    `unsafe-eval` and the unused CDN origin and adds `object-src`, `base-uri`,
    `form-action` and `frame-ancestors`; `X-Powered-By` is disabled; the HTTPS
    redirect never builds its target from the `Host` header.
S8. `npm audit` findings are reduced without breaking the build.

## Tasks

| ID | Specs | Route | Status | Commit |
| --- | --- | --- | --- | --- |
| T1 | S1, S2 | inline | done | 0c2a857 |
| T2 | S3 | inline | done | eb6ea9a |
| T3 | S4 | inline | done | e00c1a6 |
| T4 | S5 | inline | done | 37be00d |
| T5 | S6 | inline | done | eb6ea9a |
| T6 | S7 | inline | done | 0a8e5b7 |
| T7 | S8 | inline | done | 9c7e64e |

Verification (no test runner in the repo):

- T1: 20/20 assertions on `src/lib/admin-access.ts` via `tsx`, including the
  reported bypass (`x-localhost.com`, `localhost.attacker.io`) and the port rule.
  End to end on a production build: without `ENABLE_ADMIN` every host gets 404;
  with `ENABLE_ADMIN=true` and `Host: localhost:9002` the panel returns 200 while
  a forged host still returns 404.
- T2: 15/15 assertions on `src/lib/upload.ts`; `path.extname` no longer appears in
  any admin action, and `mapa-interactivo` gained the missing size/MIME checks.
- T3: 14/14 assertions on `src/lib/rate-limit.ts` (6th attempt blocked, other IP
  unaffected, window reset, forged `x-forwarded-for` prefix ignored).
- T4 + T5: 23/23 assertions on `safeHref` and `resolveWithinUploads`
  (`javascript:`, `data:`, `vbscript:`, protocol-relative, `../` escapes).
- T6: production build inspected — HSTS present, CSP without `unsafe-eval` and
  `unpkg.com`, `object-src`/`base-uri`/`form-action`/`frame-ancestors` added, no
  `X-Powered-By`.
- T7: `npm audit` 52 -> 50 affected packages; `next` and `nodemailer` advisories
  cleared. `npm run typecheck` clean; `next build` exit 0; 10 public routes 200.

## Log

L1 (user, verbatim): "puedes hacerle una auditoria de seguridad?"

L2 (user, verbatim): "si! arranca por lo más crítico. Luego los demas."

L3: Audit findings accepted as scope, in severity order:
C1 `/admin` gate bypassed by `Host: x-localhost.com` (substring match).
C2 no authentication exists anywhere; the Host check is the only barrier.
C3 uploaded files keep the client filename extension while only `file.type` is
validated, so an `.html` upload served same-origin executes (CSP allows inline).
H4 52 dependency vulnerabilities (5 critical, 22 high).
H5 contact form has no rate limit and opens two SMTP connections per request.
M6 unescaped user input in the contact email HTML and From display name.
M7 CSP is decorative; no HSTS.
M8 `javascript:` link URLs pass through `serializeSlate`.
L9 HTTPS redirect built from the `Host` header.
L10 `fs.rm` on admin delete has no containment check.
L11 `X-Powered-By: Next.js` is emitted.

L4 (decision): C2 is fixed by failing closed instead of adding a login. The admin is a
local authoring tool and its data is baked at build time, so production should never
reach it. `ENABLE_ADMIN` is a server-side env var, not a header, so a forged `Host`
cannot re-enable it.

L5 (decision): the HTTPS redirect uses `SITE_URL` and does nothing when it is unset,
so local production runs and platforms that terminate TLS themselves are not looped
into an external origin.

L6 (decision): T1 and T6 both touch `src/middleware.ts`, so the header block was
temporarily reverted to commit the fail-closed admin gate alone (0c2a857) before
committing the headers (0a8e5b7). The auth-adjacent change stays reviewable by itself.

L7 (decision): T2 and T5 share `src/lib/upload.ts` and the same eight admin actions,
and deleting without validating the path is only safe once the extension is
MIME-derived; they ship as one commit (eb6ea9a).

L8 (decision): T7 keeps `next` pinned to an exact version (`15.5.28`) instead of the
caret npm writes by default, matching the repository's previous policy for the
framework. `nodemailer` keeps its caret range like every other runtime dependency.

L9 (observation): `next build` emits a pre-existing, harmless warning about
`@opentelemetry/exporter-jaeger` missing under `@opentelemetry/sdk-node`. It comes
from genkit and was already present before this work.

L10 (observation, out of scope, reported to the user): the three entity routes
(`atractivos/[id]`, `localidades/[id]`, `novedades/[id]`) are statically generated
(`●` in the build output, `generateStaticParams` present), so `generateMetaTags`
runs Gemini once per entity **at build time**, not per request. Unknown ids return
before the AI call, and a failure falls back to basic metadata. The real costs are
build time, non-deterministic metadata between builds, and every entity's content
being sent to Google. Not a vulnerability; listed for the user to decide.
