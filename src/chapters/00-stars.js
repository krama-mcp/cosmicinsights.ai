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
