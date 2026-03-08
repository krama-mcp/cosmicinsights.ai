export function buildQuestionChapter(camera) {
  const tl = window._cosmicTimeline

  // Progress 0.86-1.0
  tl.to(camera.position, { z: 14, y: 4, duration: 0.14, ease: 'power2.out' }, 0.86)

  tl.call(() => {
    document.getElementById('question-text')?.classList.add('visible')
  }, [], 0.90)

  tl.call(() => {
    document.getElementById('cta-button')?.classList.add('visible')
  }, [], 0.95)
}
