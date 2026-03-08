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
