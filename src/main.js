import { initScene } from './scene.js'
import { initScroll } from './scroll.js'
import { initUI } from './ui.js'

async function main() {
  const sceneObjects = await initScene()
  initScroll(sceneObjects)
  initUI()
}

main()
