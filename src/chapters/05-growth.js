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
