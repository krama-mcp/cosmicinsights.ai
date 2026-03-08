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
    if (child.geometry && child.geometry.type === 'RingGeometry') {
      tl.to(child.material, { opacity: 0, duration: 0.1 }, 0.14)
    }
  })
}
