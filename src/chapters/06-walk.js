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

  // Walker bob animation
  const tickWalk = () => {
    requestAnimationFrame(tickWalk)
    const t = Date.now() * 0.003
    walker.position.y = -1.5 + Math.sin(t * 2) * 0.04
    walker.rotation.z = Math.sin(t) * 0.02
  }
  tickWalk()

  return { terrain, sun, moon, walker }
}
