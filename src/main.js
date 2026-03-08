import { initScene } from './scene.js'
import { initScroll } from './scroll.js'
import { initUI } from './ui.js'
import { addStars } from './chapters/00-stars.js'
import { buildCosmosChapter } from './chapters/01-cosmos.js'
import { buildConvergenceChapter } from './chapters/02-convergence.js'
import { buildWombChapter } from './chapters/03-womb.js'
import { buildFormationChapter } from './chapters/04-formation.js'
import { buildGrowthChapter } from './chapters/05-growth.js'
import { buildWalkChapter } from './chapters/06-walk.js'
import { buildQuestionChapter } from './chapters/07-question.js'

async function main() {
  const { scene, camera, renderer } = await initScene()

  // Always-on background
  addStars(scene)

  // Chapter 1: Cosmos (sets camera position)
  const { group, planets } = buildCosmosChapter(scene, camera)

  // Wire scroll BEFORE chapters that use window._cosmicTimeline
  initScroll({ scene, camera, renderer })

  // Chapters 2-7: build timeline
  buildConvergenceChapter(scene, camera, planets, group)
  const { wombMat } = buildWombChapter(scene, camera)
  buildFormationChapter(scene, camera)
  const { figure } = buildGrowthChapter(scene, camera, wombMat)
  buildWalkChapter(scene, camera, figure)
  buildQuestionChapter(camera)

  // UI overlays
  initUI()
}

main()
