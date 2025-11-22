## Copilot instructions — Farray's Center web (concise)

Purpose: give an AI agent the minimum, precise facts needed to contribute code safely and productively.

Key facts
- Stack: React 19 + TypeScript (strict), Vite, TailwindCSS, React Router v7, Vitest.
- Multilingual site: routes are locale-prefixed (/:locale/...). i18n is implemented in `hooks/useI18n.tsx` and locale modules live in `i18n/locales/`.
- Prerendering: `npm run build` runs `vite build` then `node prerender.mjs` which generates static pages (16 pages: 4 languages × 4 pages). `index.tsx` hydrates prerendered HTML using `hydrateRoot()` when content exists.

Important files to reference (examples)
- `hooks/useI18n.tsx` — locale detection, lazy import of translations, cookie/localStorage persistence, `t()` function.
- `prerender.mjs` — generates localized HTML with SEO, sets `localStorage` + cookie before hydration, marks root with `data-prerendered`.
- `scripts/create-class-page.mjs` — CLI to scaffold a new class page (generates component, i18n skeleton, image folders, and updates `App.tsx` and `scripts/build-images.mjs`).
- `scripts/build-images.mjs` — uses sharp to create multiple sizes/formats from `public/images/classes/{class}/raw/` → `img/`.
- `components/DancehallPageV2.tsx` and `components/DancehallPage.tsx` — canonical page templates and patterns (Helmet usage, sections, SchemaMarkup).

Developer workflows (exact commands)
- npm install
- npm run dev — Vite dev server
- npm run build — production build + prerender (runs prerender.mjs)
- npm run preview — preview production build
- npm run build:images — optimize images (required for new class pages)
- npm run create:class -- --name=NAME [--instructor="..."] — scaffold a class page
- npm run test / npm run test:run — run vitest
- npm run lint / npm run lint:fix — ESLint
- npm run typecheck — tsc --noEmit

Project-specific conventions (do not assume defaults)
- All user-facing strings must be in i18n locale files. Use `t('key')`. Missing keys return the key in DEV and warn to console.
- Routes must include `/:locale` prefix. When adding pages, either run `create:class` or update `App.tsx` and `prerender.mjs` consistently.
- Image flow: add originals to `public/images/classes/<slug>/raw/`, run `npm run build:images`, use generated files in `public/images/classes/<slug>/img/` or import via `vite-imagetools`.
- Keep TypeScript strict; avoid `any`. Components follow `React.FC<Props>` pattern and define prop interfaces.

Editing tips for AI agents
- To add a class page: run `npm run create:class` (preferred) — it will scaffold component, i18n keys, and folders. If editing manually: add component in `components/`, add lazy import + route in `App.tsx`, add i18n keys to `i18n/locales/*.ts`, and add image folders plus update `scripts/build-images.mjs` classes array.
- For SEO changes, update `prerender.mjs` (meta templates) and corresponding i18n titles/descriptions.
- For translation edits, update `i18n/locales/es.ts` first (source), then translate other locale files; `TranslationKeys` enforces keys.

Safety & verification checklist for automated edits
- Run `npm run typecheck` and `npm run lint` after edits.
- If you change routes or add prerender pages, run `npm run build` and verify `dist/{locale}/{page}/index.html` was created.
- If you add images, run `npm run build:images` and confirm files in `public/images/classes/<slug>/img/`.

Where to look for more docs
- `.claude/` and `EJEMPLO_USO_IMAGENES.md` contain process notes and examples. Use them for step-by-step tasks described above.

If anything here is unclear or you want the longer original file merged instead, tell me which sections to expand or preserve and I will iterate.
