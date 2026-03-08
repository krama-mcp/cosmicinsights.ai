import { initScene } from './scene.js'
import { initScroll } from './scroll.js'
import { initUI } from './ui.js'
import { addStars } from './chapters/00-stars.js'
import { buildCosmosChapter } from './chapters/01-cosmos.js'

async function main() {
  const { scene, camera, renderer } = await initScene()
  addStars(scene)
  const { group, planets } = buildCosmosChapter(scene, camera)
  initScroll({ scene, camera, renderer })
  initUI()
}

main()
