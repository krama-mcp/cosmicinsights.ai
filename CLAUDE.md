# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Dev server at http://localhost:5173
npm run build      # Production build → dist/
npm run preview    # Preview the production build locally
```

No test suite exists yet. Build success (`npm run build` exits 0) is the verification step.

## Architecture

**Single-page, scroll-driven 3D experience.** One Three.js scene, one camera, one GSAP timeline. The user scrolls through 700vh of invisible scroll space — scroll position (0–1) is mapped to the paused GSAP timeline via ScrollTrigger.

### Initialization order in `src/main.js`

The startup sequence is order-sensitive:

1. `initScene()` — creates renderer, scene, camera, bloom composer, starts the render loop
2. `addStars()` — always-on background, independent
3. `buildCosmosChapter()` — sets initial camera position
4. **`initScroll()`** — MUST be called before any chapter that registers tweens, because it creates `window._cosmicTimeline`
5. Chapters 2–7 — each calls `window._cosmicTimeline.to(...)` to register scroll-driven tweens
6. `initUI()` — appends DOM overlays

### Shared globals (set by `src/scroll.js`)

Chapters communicate through three window globals:
- `window._cosmicTimeline` — the paused GSAP timeline all chapters animate against
- `window._cosmicScene` — Three.js scene reference
- `window._cosmicCamera` — Three.js camera reference

### Scroll progress map

| Progress | Chapter file | What happens |
|----------|-------------|--------------|
| 0.00–0.14 | `01-cosmos.js` | Geocentric planets orbit (idle) |
| 0.14–0.28 | `02-convergence.js` | Planets spiral to singularity |
| 0.28–0.42 | `03-womb.js` | Golden womb sphere expands |
| 0.42–0.57 | `04-formation.js` | Embryo materialises |
| 0.57–0.71 | `05-growth.js` | Figure grows toddler → adult |
| 0.71–0.86 | `06-walk.js` | Earth terrain + day/night walk |
| 0.86–1.00 | `07-question.js` | Question text + CTA fade in |

### Inter-chapter data flow

Some chapters depend on objects returned by earlier chapters:

```
buildWombChapter()    → { wombMat }  → buildGrowthChapter(wombMat)
buildGrowthChapter()  → { figure }   → buildWalkChapter(figure)
buildCosmosChapter()  → { group, planets } → buildConvergenceChapter(planets, group)
```

### UI overlays (`src/ui.js`)

All DOM elements are created with `document.createElement` + `textContent`. **Never use `innerHTML`** — project convention enforced throughout. Styles are applied via `Object.assign(el.style, {...})`. The `#question-text` and `#cta-button` elements start with `color: rgba(255,255,255,0)` and become visible when the `visible` CSS class is added by `07-question.js` at scroll progress 0.90 and 0.95.

### Post-processing

`src/scene.js` uses `EffectComposer` with `UnrealBloomPass` (strength=0.8, radius=0.4, threshold=0.85). The render loop calls `composer.render()` instead of `renderer.render()`. If adding new passes, import from `three/examples/jsm/postprocessing/`.

## Deployment

Built as a static site. Output is `dist/`. Deploy by connecting the GitHub repo to Netlify:
- Build command: `npm run build`
- Publish directory: `dist`
- Custom domain: `cosmicinsights.ai` (GoDaddy DNS → Netlify nameservers)

## Key constraints

- No framework — vanilla JS + ES modules only
- No `innerHTML` anywhere in `src/` — use `textContent` and DOM methods
- Chapter functions must not be called before `initScroll()` if they register timeline tweens
- The `#scroll-container` div drives scroll (700vh height) — never reduce this
