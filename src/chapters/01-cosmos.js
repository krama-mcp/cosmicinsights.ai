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
