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
