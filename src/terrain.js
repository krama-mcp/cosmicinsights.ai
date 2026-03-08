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
