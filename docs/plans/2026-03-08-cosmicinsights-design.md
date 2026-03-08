# CosmicInsights.ai — Design Document
**Date:** 2026-03-08
**Domain:** cosmicinsights.ai (GoDaddy, DNS → Netlify)
**Stack:** Three.js + GSAP ScrollTrigger + Vite
**Hosting:** Netlify (free tier)

---

## Vision

A scroll-driven immersive 3D experience that tells the entire journey of life — from cosmic formation to birth to a person walking through day and night on Earth. The visual narrative maps directly to the philosophy of CosmicInsights.ai: noticing the impermanence of regular life and seeking permanent bliss by understanding the true self.

> *"The journey continues. But who is the walker?"*

---

## Philosophy & Narrative Mapping

| Visual | Philosophical meaning |
|--------|----------------------|
| Geocentric planets orbiting | Universal consciousness — the cosmic order |
| Planets converging to light | The point of creation — Brahman |
| Womb forming | The Atman entering physical form |
| Baby developing | The soul taking shape in Maya |
| Growth from toddler → adult | The Jiva's journey through life stages |
| Person walking through day/night | Impermanence — the continuous cycle of Maya |
| The final question | The invitation to seek the permanent Self |

---

## The 7 Scroll Chapters

| # | Chapter | Description |
|---|---------|-------------|
| 1 | **The Cosmos** | Hero — geocentric planets orbiting a dark center. Stars. Slow, majestic rotation. CosmicInsights.ai logo fades in. |
| 2 | **Convergence** | Planets spiral inward. Orbital paths glow gold. A singularity of light forms at center. |
| 3 | **The Womb** | Light expands into a translucent golden womb. Camera pushes in close. Pulses with warmth. |
| 4 | **Formation** | Embryo appears, curled. Head, body, limbs form slowly. Soft heartbeat pulse effect. |
| 5 | **Birth & Growth** | Figure emerges. Toddler → child → teen → young adult. Abstract gender-agnostic glowing humanoid silhouette morphs through each stage. |
| 6 | **The Walk** | Scene dissolves into Earth — atmospheric terrain (igloo.inc style). A gender-agnostic figure in their 40s walks endlessly. Sun and moon arc across sky. Day/night cycles on loop. |
| 7 | **The Question** | Walk continues but text fades in: *"The journey continues. But who is the walker?"* CTA: **"Begin your inquiry →"** |

---

## Visual Design Language

### Color Journey
| Chapter | Palette | Mood |
|---------|---------|------|
| Cosmos | Deep black + cold blue-white stars | Infinite, silent |
| Convergence | Gold light emerging from dark | Creation awakening |
| Womb | Warm amber + translucent gold | Safe, sacred |
| Growth | Soft white glow, neutral tones | Pure, ageless |
| The Walk | Earthy browns + atmospheric blue sky | Real, temporal |
| The Question | Desaturated + soft white text | Still, contemplative |

### Typography
- Font: `Space Grotesk` — elegant, timeless, not corporate
- Minimal text throughout — words appear only when scroll pauses at a chapter
- Final question: centered, slow fade-in

### The Walking Scene
- Low-poly Earth terrain with subtle displacement shader
- Atmospheric haze on horizon (igloo.inc aesthetic)
- Sun and moon as visible spheres arcing on a timed loop
- Stars at night, fading at dawn
- Humanoid: gender-agnostic, slightly stylized, subtle inner glow
- Loops forever — the person never stops walking

---

## Technical Architecture

### Stack
- **Three.js** `^0.170` — 3D rendering
- **GSAP + ScrollTrigger** `^3.12` — scroll animation driver
- **Vite** `^6.0` — build tool

### How Scroll Works
```
Scroll position (0–100%)
        ↓
  GSAP ScrollTrigger
        ↓
  Scrubs Three.js animation timeline
        ↓
  Camera position + object transforms update per frame
```

### Single Continuous Scene
One Three.js renderer, one camera. No page reloads. Chapters are camera positions + object states within the same scene.

### Asset Strategy
- **Planets** → Three.js `SphereGeometry` + NASA free texture maps
- **Womb** → Translucent sphere with inner `PointLight` + particle system
- **Human figure** → Abstract low-poly humanoid GLTF (Sketchfab free) + Mixamo walk cycle
- **Earth terrain** → Three.js `PlaneGeometry` with GLSL displacement shader
- **Sky/atmosphere** → Custom gradient shader + animated sun/moon spheres
- **Sound (optional)** → Ambient cosmic drone → heartbeat → wind/footsteps

### Performance Targets
- < 3MB total JS bundle
- 60fps on modern laptops
- Mobile: graceful degradation (reduced particles, simpler shaders)

---

## Project File Structure

```
cosmicinsights.ai/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── assets/
│       ├── textures/       # Planet textures
│       ├── models/         # GLTF humanoid + walk animation
│       └── audio/          # Ambient sound (optional)
└── src/
    ├── main.js             # Entry — Three.js renderer + GSAP
    ├── scene.js            # Single scene manager
    ├── scroll.js           # GSAP ScrollTrigger wiring
    ├── terrain.js          # Earth terrain shader
    ├── ui.js               # Text overlays + CTA
    └── chapters/
        ├── 01-cosmos.js
        ├── 02-convergence.js
        ├── 03-womb.js
        ├── 04-formation.js
        ├── 05-growth.js
        ├── 06-walk.js
        └── 07-question.js
```

---

## Deployment

```
Vite build  →  dist/
      ↓
Drag dist/ to Netlify
      ↓
Add custom domain: cosmicinsights.ai
      ↓
In GoDaddy: change nameservers → Netlify
      ↓
Live at https://cosmicinsights.ai
```

---

## Success Criteria
- Smooth 60fps scroll experience on desktop
- Each chapter transitions feel cinematic and seamless
- The walking scene loops beautifully with day/night cycling
- The final question lands emotionally
- Site loads in under 5 seconds on broadband
