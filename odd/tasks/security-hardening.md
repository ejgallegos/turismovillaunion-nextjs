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
| T1 | S1, S2 | inline | pending | |
| T2 | S3 | inline | pending | |
| T3 | S4 | inline | pending | |
| T4 | S5 | inline | pending | |
| T5 | S6 | inline | pending | |
| T6 | S7 | inline | pending | |
| T7 | S8 | inline | pending | |

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
