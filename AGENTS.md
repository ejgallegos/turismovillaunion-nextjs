# AGENTS.md — Villa Unión del Talampaya

Next.js 15 (App Router) + TypeScript + Tailwind + shadcn/ui (Radix) tourism site.
Content lives in JSON files, not a database. No Firebase, no tests.

## Commands

```bash
npm run dev          # dev server on port 9002
npm run build        # next build
npm run start        # port 3000, forces NODE_ENV=production
npm run typecheck    # tsc --noEmit — the only real gate
npm run genkit:dev   # Genkit AI server (src/ai/dev.ts)
```

- **Do not run `npm run lint`.** There is no ESLint config in the repo, so `next lint`
  stops on an interactive "How would you like to configure ESLint?" prompt and hangs
  non-interactive sessions.
- **`npm run build` does not type-check.** `next.config.ts` sets
  `typescript.ignoreBuildErrors: true`, so a green build says nothing about types.
  Always run `npm run typecheck`.
- **No test framework, no test script, zero test files.** Verification is
  `npm run typecheck` plus HTTP smoke checks against the dev server. For dynamic
  routes use `curl -g`, otherwise curl treats `[id]` as a URL glob and exits 3.

## Data layer (read this before debugging stale content)

- Source of truth is `data/*.json` at the **repo root** (9 files). There is no
  `src/data/` — it was a duplicate and was deleted.
- Services in `src/lib/*.service.ts` **import** their JSON through the bundler
  (`import x from '../../data/x.json'`), while `save*()` writes with `fs` to
  `process.cwd()/data/`. Consequence: runtime writes are **not** reflected by an
  already-built server, because the JSON was inlined at build time.
- Publishing a content change therefore means: edit locally → commit the JSON →
  rebuild/redeploy. In dev the file watcher reloads it, so dev "just works".
- `data/` is absent from the Docker runner stage and does not need to be there;
  the data is baked into `.next`.
- Only some pages opt out of static rendering (`/mapas`, `/servicios`,
  `/folletos`, `/mapa-interactivo`, and every admin page). `/`, `/atractivos*`,
  `/localidades*`, `/novedades*` have **no** `export const dynamic`, so they are
  pre-rendered from the JSON at build time. If an edit is not showing there, it is
  usually a build/static cache, not a broken read.
- Admin server actions validate input with Zod (`src/app/admin/*/actions.ts`)
  before touching the filesystem.

## Admin panel is local-only authoring

- `src/middleware.ts` returns 404 for `/admin*` and `/login*` when
  `NODE_ENV=production` and the host is not localhost/127.0.0.1. This is by design,
  not a bug to "fix".
- The admin CRUD writes `data/*.json` and uploads to `public/uploads/<section>/<slug>/`,
  storing `/uploads/...` paths in JSON.
- Server actions return `{ success, errors }` and must **not** call `redirect()`;
  the form component renders the returned state.

## Gotchas that have already caused bugs

- **Public pages must read from a service.** A component with a literal array
  (`const mapasData = [...]`) silently shadowed `data/mapas.json`, so deleting a map
  in admin never removed it from the public page. The same page also passed no data
  into the component, so the fallback was always used. If a deleted entity still
  shows up, grep the component for a hardcoded list before blaming cache.
- **Rich text fields are stringified Slate JSON**, not plain strings. Use
  `plainTextFromSlate()` from `@/lib/slate-helpers` for display and
  `serializeSlate()` from `@/lib/slate-serializer` before saving. Do not
  `.slice()` the raw value.
- **The hero is a client component** that renders a skeleton server-side and fetches
  slides through the server action `getHeroSlidesData`
  (`src/components/landing/actions.ts`). Its title, subtitle, button text and href
  never appear in the initial HTML, so grepping the page source proves nothing.
  Its CTA is data-driven from `data/slider.json`.
- **Adding an external script, font, image host or frame requires editing the CSP**
  in `src/middleware.ts`, or it gets blocked at runtime with no build error.

## Conventions

- Path alias `@/*` → `./src/*`. `tsconfig.json` has `strict: true`.
- Files and route folders are kebab-case; components and types PascalCase; server
  actions camelCase verb-first (`upsertNovedad`). UI text is Spanish (Rioplatense).
- Use existing `@/components/ui/*` (shadcn, configured in `components.json`, aliases
  `@/components`, `@/lib`, `@/hooks`, icons from `lucide`). Add new primitives with
  the shadcn CLI rather than hand-rolling Radix wrappers.
- Style with semantic Tailwind tokens (`primary`, `secondary`, `accent`,
  `destructive`, `muted`) and the `font-body` / `font-headline` / `font-display`
  families (PT Sans). Brand values from `docs/blueprint.md`.
- Public pages live in `src/app/<section>/`, admin CRUD in `src/app/admin/<section>/`
  with a sibling `actions.ts`. Public page data flows: page (server) → service →
  props on a `landing/*` component.

## Sources of truth and non-sources

- Trust: `package.json`, `next.config.ts`, `tsconfig.json`, `src/middleware.ts`,
  `components.json`, `src/lib/*.service.ts`, `data/*.json`, `.env` (local, untracked;
  tracked template is `env-example`).
- Do **not** trust: `README.md` (stale Firebase Studio boilerplate). `docs/blueprint.md`
  is product/style intent only, not architecture. `patches/` contains `react-quill`
  patches for a dependency that is not installed — ignore it.
- Deployment: both a `Dockerfile` (multi-stage, `next start`) and `apphosting.yaml`
  (Firebase App Hosting, `maxInstances: 1`) exist.
