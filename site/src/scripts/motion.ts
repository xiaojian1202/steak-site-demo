// Shared scroll/motion system for the "conceptual sketch" world. One place
// owns Lenis (momentum scrolling) + GSAP ScrollTrigger wiring; every
// component calls the small helpers below instead of hand-rolling
// ScrollTrigger config, so the reduced-motion fallback only has to live
// once.
import {gsap} from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

let lenis: Lenis | null = null

if (!prefersReducedMotion()) {
  lenis = new Lenis({
    duration: 1.1,
    smoothWheel: true,
  })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000)
  })
  gsap.ticker.lagSmoothing(0)
}

/** Fade/translate/clip-path reveal the first time `el` crosses into view. */
export function revealOnScroll(
  el: Element,
  opts: {y?: number; clipFrom?: string; stagger?: number; delay?: number} = {},
) {
  if (prefersReducedMotion()) return
  const {y = 28, clipFrom, stagger, delay = 0} = opts
  gsap.set(el, {
    opacity: 0,
    y,
    clipPath: clipFrom,
  })
  ScrollTrigger.create({
    trigger: el,
    start: 'top 85%',
    once: true,
    onEnter: () =>
      gsap.to(el, {
        opacity: 1,
        y: 0,
        clipPath: clipFrom ? 'inset(0% 0% 0% 0%)' : undefined,
        duration: 0.9,
        delay,
        stagger,
        ease: 'power3.out',
      }),
  })
}

/** Momentum-scroll to `target` (a selector or element) using the shared Lenis instance. */
export function scrollToTarget(target: string | Element) {
  if (lenis) {
    lenis.scrollTo(target as Parameters<Lenis['scrollTo']>[0], {})
    return
  }
  const el = typeof target === 'string' ? document.querySelector(target) : target
  el?.scrollIntoView({behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start'})
}

/** Scroll-linked vertical drift — `speed` > 1 moves faster than the page, < 1 slower. */
export function parallax(el: Element, speed = 0.5) {
  if (prefersReducedMotion()) return
  gsap.to(el, {
    yPercent: (1 - speed) * 40,
    ease: 'none',
    scrollTrigger: {
      trigger: el.closest('section') ?? el,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  })
}

/** Pin `el` in place while its children reveal one-by-one, then release. */
export function pinSection(el: Element, rows: Element[]) {
  if (prefersReducedMotion() || rows.length === 0) return
  gsap.set(rows, {opacity: 0.25})
  ScrollTrigger.create({
    trigger: el,
    start: 'top top',
    end: `+=${rows.length * 120}`,
    pin: true,
    pinSpacing: true,
    onUpdate: (self) => {
      const active = Math.floor(self.progress * rows.length)
      rows.forEach((row, i) => {
        gsap.to(row, {opacity: i <= active ? 1 : 0.25, duration: 0.3})
      })
    },
  })
}

/** Animate an inline SVG's strokes drawing themselves in on load. */
export function drawIn(paths: SVGGeometryElement[], opts: {stagger?: number} = {}) {
  if (prefersReducedMotion() || paths.length === 0) return
  paths.forEach((path) => {
    const length = path.getTotalLength()
    gsap.set(path, {strokeDasharray: length, strokeDashoffset: length})
  })
  gsap.to(paths, {
    strokeDashoffset: 0,
    duration: 1.4,
    ease: 'power2.inOut',
    stagger: opts.stagger ?? 0.08,
  })
}

export {gsap, ScrollTrigger}
