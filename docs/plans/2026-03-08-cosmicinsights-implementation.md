# CosmicInsights.ai Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a scroll-driven immersive 3D website for CosmicInsights.ai that takes the visitor through 7 chapters — from geocentric cosmos to birth, growth, and an eternal walk through day and night on Earth.

**Architecture:** Single Three.js scene with one renderer and one camera. GSAP ScrollTrigger maps scroll position (0-100%) to a master animation timeline. Each chapter is a module that registers its objects and animations into the shared scene and timeline. No page reloads, no routing.

**Tech Stack:** Three.js 0.170, GSAP 3.12 + ScrollTrigger, Vite 6, vanilla JS (no framework)

---

## Task 1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `src/main.js`

**Step 1: Initialize the project**

```bash
cd "/Users/kiranramanna/Documents/GitHub/cosmicinsights.ai"
npm create vite@latest . -- --template vanilla
```

When prompted: select "Vanilla" + "JavaScript". Say yes to overwrite.

**Step 2: Install dependencies**

```bash
npm install three gsap
npm install -D vite
```

**Step 3: Replace `index.html` with:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CosmicInsights.ai</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: auto; }
    body {
      background: #000;
      overflow-x: hidden;
      font-family: 'Space Grotesk', sans-serif;
    }
    #canvas-container {
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      z-index: 0;
    }
    #scroll-container {
      position: relative;
      z-index: 1;
      height: 700vh;
    }
    #ui {
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      z-index: 10;
      pointer-events: none;
    }
  </style>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500&display=swap" rel="stylesheet">
</head>
<body>
  <div id="canvas-container"></div>
  <div id="scroll-container"></div>
  <div id="ui"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

**Step 4: Replace `src/main.js` with:**

```js
import { initScene } from './scene.js'
import { initScroll } from './scroll.js'
import { initUI } from './ui.js'

async function main() {
  const scene = await initScene()
  initScroll(scene)
  initUI()
}

main()
```

**Step 5: Delete Vite boilerplate**

```bash
rm -f src/counter.js src/style.css public/vite.svg src/javascript.svg
```

**Step 6: Verify it builds**

```bash
npm run dev
```

Expected: Vite dev server at `http://localhost:5173`, black screen, no console errors.

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: scaffold Vite + Three.js + GSAP project"
```

---

## Task 2: Scene Foundation

**Files:**
- Create: `src/scene.js`
- Create: `src/scroll.js`
- Create: `src/ui.js`

**Step 1: Create `src/scene.js`**

```js
import * as THREE from 'three'

export async function initScene() {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.2
  document.getElementById('canvas-container').appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000005)
  scene.fog = new THREE.FogExp2(0x000005, 0.02)

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 0, 20)

  const ambient = new THREE.AmbientLight(0xffffff, 0.1)
  scene.add(ambient)

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  })

  function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
  }
  animate()

  return { scene, camera, renderer }
}
```

**Step 2: Create `src/scroll.js`**

```js
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function initScroll({ scene, camera }) {
  const tl = gsap.timeline({ paused: true })

  ScrollTrigger.create({
    trigger: '#scroll-container',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1.5,
    onUpdate: (self) => {
      tl.progress(self.progress)
    }
  })

  window._cosmicTimeline = tl
  window._cosmicScene = scene
  window._cosmicCamera = camera
}
```

**Step 3: Create `src/ui.js`**

```js
export function initUI() {
  const ui = document.getElementById('ui')

  const logo = document.createElement('div')
  logo.id = 'logo'
  logo.textContent = 'COSMICINSIGHTS.AI'
  Object.assign(logo.style, {
    position: 'absolute',
    top: '40px',
    left: '50%',
    transform: 'translateX(-50%)',
    color: 'rgba(255,255,255,0.9)',
    fontSize: 'clamp(14px, 2vw, 20px)',
    letterSpacing: '0.3em',
    fontWeight: '300',
  })
  ui.appendChild(logo)

  const hint = document.createElement('div')
  hint.id = 'scroll-hint'
  hint.textContent = 'Scroll to begin your journey'
  Object.assign(hint.style, {
    position: 'absolute',
    bottom: '40px',
    left: '50%',
    transform: 'translateX(-50%)',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '13px',
    letterSpacing: '0.2em',
    fontWeight: '300',
    animation: 'pulse 2s ease-in-out infinite',
  })
  ui.appendChild(hint)

  const style = document.createElement('style')
  style.textContent = '@keyframes pulse { 0%,100%{opacity:.5} 50%{opacity:1} }'
  document.head.appendChild(style)
}
```

**Step 4: Verify**

Expected: Black screen, "COSMICINSIGHTS.AI" at top, pulsing hint at bottom, no errors.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: three.js scene foundation + gsap scroll wiring + ui shell"
```

---

## Task 3: Stars Background

**Files:**
- Create: `src/chapters/00-stars.js`
- Modify: `src/main.js`

**Step 1: Create `src/chapters/00-stars.js`**

```js
import * as THREE from 'three'

export function addStars(scene) {
  const count = 8000
  const positions = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 600
    positions[i * 3 + 1] = (Math.random() - 0.5) * 600
    positions[i * 3 + 2] = (Math.random() - 0.5) * 600
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const mat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.15,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.8,
  })

  const stars = new THREE.Points(geo, mat)
  scene.add(stars)

  const tick = () => {
    requestAnimationFrame(tick)
    stars.rotation.y += 0.00005
    stars.rotation.x += 0.00002
  }
  tick()

  return stars
}
```

**Step 2: Update `src/main.js`**

```js
import { initScene } from './scene.js'
import { initScroll } from './scroll.js'
import { initUI } from './ui.js'
import { addStars } from './chapters/00-stars.js'

async function main() {
  const { scene, camera, renderer } = await initScene()
  addStars(scene)
  initScroll({ scene, camera, renderer })
  initUI()
}

main()
```

**Step 3: Verify**

Expected: Black sky filled with slowly rotating stars.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: animated starfield background"
```

---

## Task 4: Chapter 1 — The Cosmos (Geocentric Planets)

**Files:**
- Create: `src/chapters/01-cosmos.js`
- Modify: `src/main.js`

**Step 1: Create `src/chapters/01-cosmos.js`**

```js
import * as THREE from 'three'

const PLANET_DATA = [
  { name: 'moon',    radius: 0.3,  orbitR: 3,  speed: 0.8,  color: 0xccccaa },
  { name: 'sun',     radius: 1.2,  orbitR: 7,  speed: 0.3,  color: 0xffdd44 },
  { name: 'mercury', radius: 0.25, orbitR: 5,  speed: 1.2,  color: 0xaaaaaa },
  { name: 'venus',   radius: 0.5,  orbitR: 6,  speed: 0.5,  color: 0xddbb88 },
  { name: 'mars',    radius: 0.4,  orbitR: 9,  speed: 0.25, color: 0xcc4422 },
  { name: 'jupiter', radius: 0.9,  orbitR: 13, speed: 0.1,  color: 0xcc9955 },
  { name: 'saturn',  radius: 0.7,  orbitR: 16, speed: 0.07, color: 0xddcc88 },
]

export function buildCosmosChapter(scene, camera) {
  const group = new THREE.Group()
  scene.add(group)

  // Earth at center
  const earth = new THREE.Mesh(
    new THREE.SphereGeometry(0.8, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0x2244aa, emissive: 0x112233, emissiveIntensity: 0.3 })
  )
  group.add(earth)

  const planets = PLANET_DATA.map((p, i) => {
    // Orbit ring
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(p.orbitR - 0.01, p.orbitR + 0.01, 128),
      new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.08 })
    )
    ring.rotation.x = Math.PI / 2
    group.add(ring)

    // Planet
    const isSun = p.name === 'sun'
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(p.radius, 24, 24),
      new THREE.MeshStandardMaterial({
        color: p.color,
        emissive: p.color,
        emissiveIntensity: isSun ? 0.8 : 0.1,
      })
    )
    const angle = (i / PLANET_DATA.length) * Math.PI * 2
    mesh.position.set(Math.cos(angle) * p.orbitR, 0, Math.sin(angle) * p.orbitR)
    mesh.userData = { orbitR: p.orbitR, angle, speed: p.speed, isSun }
    group.add(mesh)
    return mesh
  })

  // Sun glow light
  const sunLight = new THREE.PointLight(0xffdd44, 3, 30)
  group.add(sunLight)

  camera.position.set(0, 8, 25)
  camera.lookAt(0, 0, 0)

  let active = true
  const tick = () => {
    if (!active) return
    requestAnimationFrame(tick)
    planets.forEach((p) => {
      p.userData.angle += p.userData.speed * 0.005
      p.position.x = Math.cos(p.userData.angle) * p.userData.orbitR
      p.position.z = Math.sin(p.userData.angle) * p.userData.orbitR
      if (p.userData.isSun) sunLight.position.copy(p.position)
    })
  }
  tick()

  return { group, planets, stopOrbit: () => { active = false } }
}
```

**Step 2: Update `src/main.js`**

```js
import { buildCosmosChapter } from './chapters/01-cosmos.js'

async function main() {
  const { scene, camera, renderer } = await initScene()
  addStars(scene)
  buildCosmosChapter(scene, camera)
  initScroll({ scene, camera, renderer })
  initUI()
}
```

**Step 3: Verify**

Expected: Earth at center, 7 colored spheres orbiting with faint ring trails, stars in background.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: chapter 1 - geocentric cosmos with orbiting planets"
```

---

## Task 5: Chapter 2 — Convergence

**Files:**
- Create: `src/chapters/02-convergence.js`
- Modify: `src/main.js`

**Step 1: Create `src/chapters/02-convergence.js`**

```js
import * as THREE from 'three'

export function buildConvergenceChapter(scene, camera, planets, planetsGroup) {
  const tl = window._cosmicTimeline

  // Singularity light
  const singularityLight = new THREE.PointLight(0xffddaa, 0, 15)
  scene.add(singularityLight)

  // Glow sphere
  const glowGeo = new THREE.SphereGeometry(0.1, 16, 16)
  const glowMat = new THREE.MeshBasicMaterial({ color: 0xffffcc, transparent: true, opacity: 0 })
  const glow = new THREE.Mesh(glowGeo, glowMat)
  scene.add(glow)

  // Progress 0.14-0.28: planets spiral inward
  planets.forEach((p, i) => {
    tl.to(p.position, { x: 0, y: 0, z: 0, duration: 0.14, ease: 'power2.in' }, 0.14 + i * 0.005)
  })

  tl.to(singularityLight, { intensity: 8, duration: 0.1, ease: 'power3.in' }, 0.22)
  tl.to(glowMat, { opacity: 1, duration: 0.08 }, 0.22)
  tl.to(glow.scale, { x: 15, y: 15, z: 15, duration: 0.1, ease: 'power3.in' }, 0.22)
  tl.to(camera.position, { z: 8, y: 2, duration: 0.14, ease: 'power2.inOut' }, 0.14)

  // Fade orbit rings
  planetsGroup.children.forEach(child => {
    if (child.geometry?.type === 'RingGeometry') {
      tl.to(child.material, { opacity: 0, duration: 0.1 }, 0.14)
    }
  })
}
```

**Step 2: Update `src/main.js`**

```js
import { buildConvergenceChapter } from './chapters/02-convergence.js'

// in main():
const { group, planets } = buildCosmosChapter(scene, camera)
buildConvergenceChapter(scene, camera, planets, group)
```

**Step 3: Verify**

Scroll to ~20%: planets spiral inward, bright gold singularity forms at center.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: chapter 2 - planets converge to singularity"
```

---

## Task 6: Chapter 3 — The Womb

**Files:**
- Create: `src/chapters/03-womb.js`
- Modify: `src/main.js`

**Step 1: Create `src/chapters/03-womb.js`**

```js
import * as THREE from 'three'

export function buildWombChapter(scene, camera) {
  const tl = window._cosmicTimeline

  const wombGeo = new THREE.SphereGeometry(3, 64, 64)
  const wombMat = new THREE.MeshPhysicalMaterial({
    color: 0xffaa44,
    emissive: 0xff8800,
    emissiveIntensity: 0.3,
    transparent: true,
    opacity: 0,
    roughness: 0.1,
    transmission: 0.8,
    thickness: 1.5,
    side: THREE.FrontSide,
  })
  const womb = new THREE.Mesh(wombGeo, wombMat)
  womb.scale.set(0.1, 0.1, 0.1)
  scene.add(womb)

  const innerLight = new THREE.PointLight(0xff9933, 0, 10)
  scene.add(innerLight)

  // Progress 0.28-0.42
  tl.to(wombMat, { opacity: 0.5, duration: 0.1, ease: 'power2.out' }, 0.28)
  tl.to(womb.scale, { x: 1, y: 1, z: 1, duration: 0.14, ease: 'elastic.out(1,0.5)' }, 0.28)
  tl.to(innerLight, { intensity: 3, duration: 0.1 }, 0.30)
  tl.to(camera.position, { z: 6, y: 0, x: 0, duration: 0.14, ease: 'power2.inOut' }, 0.28)

  return { womb, innerLight, wombMat }
}
```

**Step 2: Update `src/main.js`**

```js
import { buildWombChapter } from './chapters/03-womb.js'
// const { womb, wombMat } = buildWombChapter(scene, camera)
```

**Step 3: Verify**

Scroll to ~35%: golden translucent womb expands from singularity.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: chapter 3 - womb forms from singularity"
```

---

## Task 7: Chapter 4 — Formation (Embryo)

**Files:**
- Create: `src/chapters/04-formation.js`
- Modify: `src/main.js`

**Step 1: Create `src/chapters/04-formation.js`**

```js
import * as THREE from 'three'

function buildEmbryoMesh() {
  const group = new THREE.Group()

  const makeMat = () => new THREE.MeshPhysicalMaterial({
    color: 0xffe0cc,
    emissive: 0xff9966,
    emissiveIntensity: 0.2,
    roughness: 0.8,
    transparent: true,
    opacity: 0,
  })

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.35, 24, 24), makeMat())
  head.position.set(0, 0.5, 0)

  const body = new THREE.Mesh(new THREE.SphereGeometry(0.28, 24, 24), makeMat())
  body.scale.set(1, 1.4, 1)

  const limb1 = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), makeMat())
  limb1.scale.set(1, 2.5, 1)
  limb1.position.set(0.4, -0.3, 0.1)
  limb1.rotation.z = -0.8

  const limb2 = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), makeMat())
  limb2.scale.set(1, 2.5, 1)
  limb2.position.set(-0.4, -0.3, 0.1)
  limb2.rotation.z = 0.8

  group.add(head, body, limb1, limb2)
  group.rotation.z = 0.6
  group.scale.set(0.01, 0.01, 0.01)

  return group
}

export function buildFormationChapter(scene, camera) {
  const tl = window._cosmicTimeline
  const embryo = buildEmbryoMesh()
  scene.add(embryo)

  // Progress 0.42-0.57
  tl.to(embryo.scale, { x: 0.8, y: 0.8, z: 0.8, duration: 0.15, ease: 'power2.out' }, 0.42)
  embryo.children.forEach(p => {
    tl.to(p.material, { opacity: 0.9, duration: 0.12 }, 0.43)
  })

  const tick = () => {
    requestAnimationFrame(tick)
    embryo.rotation.y += 0.003
  }
  tick()

  return { embryo }
}
```

**Step 2: Update `src/main.js`** to import and call.

**Step 3: Verify**

Scroll to ~50%: glowing abstract embryo appears curled inside the womb.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: chapter 4 - embryo formation"
```

---

## Task 8: Chapter 5 — Birth and Growth

**Files:**
- Create: `src/chapters/05-growth.js`
- Modify: `src/main.js`

**Step 1: Create `src/chapters/05-growth.js`**

```js
import * as THREE from 'three'

export function buildGrowthChapter(scene, camera, wombMat) {
  const tl = window._cosmicTimeline

  const group = new THREE.Group()
  const mat = new THREE.MeshPhysicalMaterial({
    color: 0xfff0e0,
    emissive: 0xffccaa,
    emissiveIntensity: 0.4,
    roughness: 0.9,
    transparent: true,
    opacity: 0.95,
  })

  const makePart = (geo) => new THREE.Mesh(geo, mat.clone())

  const head  = makePart(new THREE.SphereGeometry(0.18, 20, 20))
  head.position.y = 0.85

  const torso = makePart(new THREE.CapsuleGeometry(0.12, 0.35, 8, 16))
  torso.position.y = 0.4

  const legL  = makePart(new THREE.CapsuleGeometry(0.07, 0.35, 8, 16))
  legL.position.set(-0.13, 0.05, 0)
  const legR  = legL.clone()
  legR.position.x = 0.13

  const armL  = makePart(new THREE.CapsuleGeometry(0.055, 0.28, 8, 16))
  armL.position.set(-0.22, 0.45, 0)
  armL.rotation.z = 0.3
  const armR  = armL.clone()
  armR.position.x = 0.22
  armR.rotation.z = -0.3

  group.add(head, torso, legL, legR, armL, armR)
  group.scale.set(0.3, 0.3, 0.3)
  group.position.y = -1
  scene.add(group)

  // Progress 0.57-0.71
  tl.to(wombMat, { opacity: 0, duration: 0.07 }, 0.57)
  tl.to(group.scale, { x: 0.4, y: 0.4, z: 0.4, duration: 0.04, ease: 'back.out(1.5)' }, 0.57)
  tl.to(group.scale, { x: 0.6, y: 0.6, z: 0.6, duration: 0.04 }, 0.61)
  tl.to(group.scale, { x: 0.8, y: 0.8, z: 0.8, duration: 0.04 }, 0.65)
  tl.to(group.scale, { x: 1.0, y: 1.0, z: 1.0, duration: 0.04, ease: 'power1.out' }, 0.69)
  tl.to(camera.position, { z: 5, y: 1, duration: 0.14, ease: 'power2.inOut' }, 0.57)

  return { figure: group }
}
```

**Step 2: Update `src/main.js`** — pass `wombMat` from chapter 3.

**Step 3: Verify**

Scroll ~65%: womb fades, humanoid silhouette grows from toddler to adult scale.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: chapter 5 - birth and growth stages"
```

---

## Task 9: Chapter 6 — The Walk (Earth Scene)

**Files:**
- Create: `src/terrain.js`
- Create: `src/chapters/06-walk.js`
- Modify: `src/main.js`

**Step 1: Create `src/terrain.js`**

```js
import * as THREE from 'three'

export function buildTerrain(scene) {
  const geo = new THREE.PlaneGeometry(120, 120, 128, 128)
  geo.rotateX(-Math.PI / 2)

  const pos = geo.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const z = pos.getZ(i)
    const y = Math.sin(x * 0.08) * 1.5
            + Math.sin(z * 0.12) * 1.2
            + Math.sin((x + z) * 0.05) * 2.5
            + (Math.random() - 0.5) * 0.3
    pos.setY(i, y - 3)
  }
  geo.computeVertexNormals()

  const mat = new THREE.MeshStandardMaterial({
    color: 0x8a7560,
    roughness: 0.95,
    metalness: 0,
    fog: true,
  })

  const terrain = new THREE.Mesh(geo, mat)
  terrain.visible = false
  scene.add(terrain)
  return terrain
}
```

**Step 2: Create `src/chapters/06-walk.js`**

```js
import * as THREE from 'three'
import { buildTerrain } from '../terrain.js'

function buildWalker() {
  const group = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: 0x443322, roughness: 1 })

  const makePart = (geo) => new THREE.Mesh(geo, mat.clone())

  const head  = makePart(new THREE.SphereGeometry(0.15, 16, 16))
  head.position.y = 0.7
  const torso = makePart(new THREE.CapsuleGeometry(0.1, 0.3, 8, 16))
  torso.position.y = 0.35
  const legL  = makePart(new THREE.CapsuleGeometry(0.06, 0.28, 8, 16))
  legL.position.set(-0.1, 0.02, 0)
  const legR  = legL.clone(); legR.position.x = 0.1
  const armL  = makePart(new THREE.CapsuleGeometry(0.045, 0.22, 8, 16))
  armL.position.set(-0.18, 0.38, 0); armL.rotation.z = 0.25
  const armR  = armL.clone(); armR.position.x = 0.18; armR.rotation.z = -0.25

  group.add(head, torso, legL, legR, armL, armR)
  return group
}

export function buildWalkChapter(scene, camera, figure) {
  const tl = window._cosmicTimeline

  const terrain = buildTerrain(scene)
  scene.fog = new THREE.FogExp2(0x8899bb, 0.018)

  const sun = new THREE.Mesh(
    new THREE.SphereGeometry(1.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xffe066 })
  )
  sun.position.set(-40, -20, -30)
  scene.add(sun)

  const sunLight = new THREE.DirectionalLight(0xffe066, 0)
  scene.add(sunLight)

  const moon = new THREE.Mesh(
    new THREE.SphereGeometry(0.8, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xddddcc })
  )
  moon.position.set(40, 20, -30)
  scene.add(moon)

  const walker = buildWalker()
  walker.position.set(0, -1.5, 0)
  walker.visible = false
  scene.add(walker)

  // Progress 0.71-0.86
  tl.call(() => {
    terrain.visible = true
    walker.visible = true
    scene.background = new THREE.Color(0x1a3a6a)
  }, [], 0.72)

  tl.to(figure.scale, { x: 0, y: 0, z: 0, duration: 0.04 }, 0.71)
  tl.to(camera.position, { x: 0, y: 3, z: 12, duration: 0.12, ease: 'power2.inOut' }, 0.71)

  // Sun arc: rises and sets
  tl.to(sun.position, { x: 0, y: 25, duration: 0.07, ease: 'sine.inOut' }, 0.73)
  tl.to(sunLight, { intensity: 2, duration: 0.04 }, 0.73)
  tl.to(sun.position, { x: 80, y: -20, duration: 0.07, ease: 'sine.in' }, 0.80)
  tl.to(sunLight, { intensity: 0, duration: 0.04 }, 0.84)

  // Moon rises
  tl.to(moon.position, { x: 0, y: 20, duration: 0.07, ease: 'sine.inOut' }, 0.82)

  // Walker bob
  const tickWalk = () => {
    requestAnimationFrame(tickWalk)
    const t = Date.now() * 0.003
    walker.position.y = -1.5 + Math.sin(t * 2) * 0.04
    walker.rotation.z = Math.sin(t) * 0.02
  }
  tickWalk()

  return { terrain, sun, moon, walker }
}
```

**Step 3: Update `src/main.js`** to import and call.

**Step 4: Verify**

Scroll ~80%: earthy terrain, walker on ground, sun arcs across sky, moon rises, atmospheric fog on horizon.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: chapter 6 - eternal walk with day/night cycle"
```

---

## Task 10: Chapter 7 — The Question

**Files:**
- Create: `src/chapters/07-question.js`
- Modify: `src/ui.js`
- Modify: `src/main.js`

**Step 1: Add question + CTA to `src/ui.js`**

At the end of `initUI()`, add:

```js
  // Question text (shown at chapter 7)
  const question = document.createElement('div')
  question.id = 'question-text'

  const line1 = document.createElement('div')
  line1.textContent = 'The journey continues.'
  const line2 = document.createElement('span')
  line2.textContent = 'But who is the walker?'
  Object.assign(line2.style, { fontSize: '0.7em', opacity: '0.6', letterSpacing: '0.15em' })
  question.append(line1, line2)

  Object.assign(question.style, {
    position: 'absolute',
    top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    color: 'rgba(255,255,255,0)',
    fontSize: 'clamp(18px, 3vw, 36px)',
    fontWeight: '300',
    letterSpacing: '0.08em',
    lineHeight: '1.6',
    transition: 'color 2s ease',
  })
  ui.appendChild(question)

  // CTA
  const cta = document.createElement('a')
  cta.id = 'cta-button'
  cta.href = '#'
  cta.textContent = 'Begin your inquiry \u2192'
  Object.assign(cta.style, {
    position: 'absolute',
    bottom: '80px', left: '50%',
    transform: 'translateX(-50%)',
    color: 'rgba(255,255,255,0)',
    fontSize: '14px',
    letterSpacing: '0.25em',
    fontWeight: '300',
    textDecoration: 'none',
    borderBottom: '1px solid rgba(255,255,255,0)',
    paddingBottom: '4px',
    transition: 'color 2s ease, border-color 2s ease',
    pointerEvents: 'none',
  })
  ui.appendChild(cta)

  // Visible state styles
  const extraStyle = document.createElement('style')
  extraStyle.textContent = `
    #question-text.visible { color: rgba(255,255,255,0.85) !important; }
    #cta-button.visible {
      color: rgba(255,255,255,0.7) !important;
      border-color: rgba(255,255,255,0.4) !important;
      pointer-events: auto !important;
      cursor: pointer;
    }
    #cta-button.visible:hover { color: #fff !important; }
  `
  document.head.appendChild(extraStyle)
```

**Step 2: Create `src/chapters/07-question.js`**

```js
export function buildQuestionChapter(camera) {
  const tl = window._cosmicTimeline

  // Progress 0.86-1.0
  tl.to(camera.position, { z: 14, y: 4, duration: 0.14, ease: 'power2.out' }, 0.86)

  tl.call(() => {
    document.getElementById('question-text')?.classList.add('visible')
  }, [], 0.90)

  tl.call(() => {
    document.getElementById('cta-button')?.classList.add('visible')
  }, [], 0.95)
}
```

**Step 3: Update `src/main.js`** to import and call.

**Step 4: Verify**

Scroll to 90%+: white text fades in at center, CTA appears at bottom.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: chapter 7 - the question and CTA"
```

---

## Task 11: Polish — Bloom + Meta Tags

**Files:**
- Modify: `src/scene.js`
- Modify: `index.html`

**Step 1: Add bloom to `src/scene.js`**

```js
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

// After renderer setup, before animate():
const composer = new EffectComposer(renderer)
composer.addPass(new RenderPass(scene, camera))
composer.addPass(new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.8,   // strength
  0.4,   // radius
  0.85   // threshold
))

// In animate(), replace renderer.render(scene, camera) with:
composer.render()
```

**Step 2: Add meta tags to `index.html` head**

```html
<meta name="description" content="A journey from the cosmos to the eternal walk. Seek what is permanent." />
<meta property="og:title" content="CosmicInsights.ai" />
<meta property="og:description" content="The journey continues. But who is the walker?" />
<meta property="og:type" content="website" />
```

**Step 3: Full journey verification checklist**

Scroll 0% to 100% and confirm:
- [ ] Stars rotate slowly in background throughout
- [ ] Ch 1: planets orbiting, Earth at center
- [ ] Ch 2: planets spiral to singularity
- [ ] Ch 3: golden womb forms
- [ ] Ch 4: embryo appears curled inside womb
- [ ] Ch 5: figure grows from toddler to adult
- [ ] Ch 6: terrain + walker + sun arc + moon rise
- [ ] Ch 7: question text + CTA fade in

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: bloom post-processing + meta tags + full journey verified"
```

---

## Task 12: Build and Deploy to Netlify

**Step 1: Build**

```bash
npm run build
```

Expected: `dist/` created, no errors.

**Step 2: Connect repo to Netlify**

1. Sign up at netlify.com (use GitHub login)
2. "Add new site" > "Import an existing project" > GitHub
3. Select `krama-mcp/cosmicinsights.ai`
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Deploy

**Step 3: Add custom domain**

In Netlify > Domain management > Add domain: `cosmicinsights.ai`

**Step 4: Update GoDaddy DNS**

In GoDaddy > DNS > change nameservers to the 4 Netlify provides.
Wait 10-30 mins for propagation.

**Step 5: Verify live at `https://cosmicinsights.ai`**

**Step 6: Final commit**

```bash
git add -A
git commit -m "chore: deployed to cosmicinsights.ai via netlify"
git push origin main
```

---

## Quick Reference

```bash
cd "/Users/kiranramanna/Documents/GitHub/cosmicinsights.ai"
npm run dev        # dev server at localhost:5173
npm run build      # outputs dist/
git push origin main  # triggers Netlify auto-deploy
```

## Scroll Progress Map

| Progress | Chapter |
|----------|---------|
| 0.00-0.14 | Ch 1: Cosmos idle |
| 0.14-0.28 | Ch 2: Convergence |
| 0.28-0.42 | Ch 3: Womb |
| 0.42-0.57 | Ch 4: Formation |
| 0.57-0.71 | Ch 5: Growth |
| 0.71-0.86 | Ch 6: The Walk |
| 0.86-1.00 | Ch 7: The Question |
