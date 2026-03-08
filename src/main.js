import { initScene } from './scene.js'
import { initScroll } from './scroll.js'
import { initUI } from './ui.js'
import { addStars } from './chapters/00-stars.js'
import { buildCosmosChapter } from './chapters/01-cosmos.js'
import { buildConvergenceChapter } from './chapters/02-convergence.js'
import { buildWombChapter } from './chapters/03-womb.js'
import { buildFormationChapter } from './chapters/04-formation.js'

async function main() {
  const { scene, camera, renderer } = await initScene()
  addStars(scene)
  const { group, planets } = buildCosmosChapter(scene, camera)
  initScroll({ scene, camera, renderer })
  buildConvergenceChapter(scene, camera, planets, group)
  const { womb, wombMat } = buildWombChapter(scene, camera)
  buildFormationChapter(scene, camera)
  initUI()
}

main()
