import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function initScroll({ scene, camera }) {
  const tl = gsap.timeline({ paused: true })

  ScrollTrigger.create({
    trigger: '#scroll-container',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1.5,
    onUpdate: (self) => {
      tl.progress(self.progress)
    }
  })

  window._cosmicTimeline = tl
  window._cosmicScene = scene
  window._cosmicCamera = camera
}
