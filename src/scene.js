import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

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

  // Bloom post-processing
  const composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))
  composer.addPass(new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.8,   // strength
    0.4,   // radius
    0.85   // threshold
  ))

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    composer.setSize(window.innerWidth, window.innerHeight)
  })

  function animate() {
    requestAnimationFrame(animate)
    composer.render()
  }
  animate()

  return { scene, camera, renderer }
}
