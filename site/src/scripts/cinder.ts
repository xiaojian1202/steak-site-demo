/*
 * Client behaviour for the Cinder / Ember & Oak steakhouse page.
 *
 * Mirrors the interaction model of the Claude Design source (`Cinder
 * Steakhouse.dc.html`): a scroll-progress rail, a header that solidifies past
 * 40px, counter-scroll parallax on the hero/about/gallery imagery, reveal-on-
 * enter for the major blocks, a mobile nav panel, and the reservation dialog.
 *
 * Two deliberate departures from the design source, both because the source
 * runs inside a fixed-height design canvas and this does not:
 *   - Breakpoint switching (nav layout, gallery carousel vs. grid) is done in
 *     CSS media queries rather than a JS `isMobile` flag, so the correct
 *     layout is in the first paint instead of arriving after hydration.
 *   - Parallax offsets are derived from each element's position relative to
 *     the viewport rather than from absolute `scrollY` thresholds (600px,
 *     1400px), which only line up with the canvas's own page height. The
 *     amplitude caps are unchanged.
 */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const clamp = (value: number, limit: number) => Math.max(-limit, Math.min(limit, value))

/** Counter-scroll offset for an element, peaking at the viewport edges. */
function parallaxOffset(el: HTMLElement, amplitude: number) {
  const rect = el.getBoundingClientRect()
  const viewportCenter = window.innerHeight / 2
  const elementCenter = rect.top + rect.height / 2
  const distance = (elementCenter - viewportCenter) / window.innerHeight
  return clamp(distance * amplitude * 2, amplitude)
}

function setupScrollEffects() {
  const header = document.querySelector<HTMLElement>('[data-header]')
  const progress = document.querySelector<HTMLElement>('[data-scroll-progress]')
  const heroMedia = document.querySelector<HTMLElement>('[data-hero-media]')
  const parallaxEls = Array.from(
    document.querySelectorAll<HTMLElement>('[data-parallax]'),
  )

  const update = () => {
    const scrollY = window.scrollY
    header?.classList.toggle('is-scrolled', scrollY > 40)

    if (progress) {
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      progress.style.width = `${max > 0 ? (scrollY / max) * 100 : 0}%`
    }

    // The hero image sits above the fold, so it tracks raw scroll distance.
    if (heroMedia) heroMedia.style.setProperty('--parallax', `${scrollY * 0.35}px`)

    for (const el of parallaxEls) {
      const amplitude = Number(el.dataset.parallax) || 0
      el.style.setProperty('--parallax', `${parallaxOffset(el, amplitude).toFixed(2)}px`)
    }
  }

  let ticking = false
  const onScroll = () => {
    if (ticking) return
    ticking = true
    requestAnimationFrame(() => {
      update()
      ticking = false
    })
  }

  update()
  window.addEventListener('scroll', onScroll, {passive: true})
  window.addEventListener('resize', onScroll, {passive: true})
}

function setupReveals() {
  const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))

  if (reduceMotion || !('IntersectionObserver' in window)) {
    for (const el of targets) el.classList.add('is-revealed')
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('is-revealed')
        observer.unobserve(entry.target)
      }
    },
    {threshold: 0.2},
  )

  for (const el of targets) observer.observe(el)
}

function setupNav() {
  const toggle = document.querySelector<HTMLButtonElement>('[data-nav-toggle]')
  const panel = document.querySelector<HTMLElement>('[data-nav-panel]')
  if (!toggle || !panel) return

  const setOpen = (open: boolean) => {
    toggle.setAttribute('aria-expanded', String(open))
    panel.hidden = !open
  }

  setOpen(false)
  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true')
  })
  panel.addEventListener('click', (event) => {
    if ((event.target as HTMLElement).closest('a')) setOpen(false)
  })
}

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
})

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
})

function formatTime(value: string) {
  if (!value) return ''
  const [hours, minutes] = value.split(':').map(Number)
  const date = new Date()
  date.setHours(hours, minutes, 0, 0)
  return timeFormatter.format(date).toLowerCase()
}

function formatDate(value: string) {
  if (!value) return ''
  return dateFormatter.format(new Date(`${value}T00:00:00`))
}

function setupReservation() {
  const dialog = document.querySelector<HTMLDialogElement>('[data-reserve-dialog]')
  const form = dialog?.querySelector<HTMLFormElement>('form')
  const confirmation = dialog?.querySelector<HTMLElement>('[data-confirmation]')
  if (!dialog || !form || !confirmation) return

  const showForm = () => {
    form.hidden = false
    confirmation.hidden = true
  }

  for (const opener of Array.from(document.querySelectorAll<HTMLElement>('[data-reserve-open]'))) {
    opener.addEventListener('click', () => {
      showForm()
      dialog.showModal()
    })
  }

  for (const closer of Array.from(dialog.querySelectorAll<HTMLElement>('[data-reserve-close]'))) {
    closer.addEventListener('click', () => dialog.close())
  }

  // Reservations are confirmed in the browser only; this template has no
  // booking backend wired up, so nothing is sent anywhere.
  form.addEventListener('submit', (event) => {
    event.preventDefault()
    const data = new FormData(form)
    const when = dialog.querySelector<HTMLElement>('[data-confirm-when]')
    if (when) {
      const date = formatDate(String(data.get('date') ?? '')) || 'your requested date'
      const time = formatTime(String(data.get('time') ?? '')) || 'your requested time'
      when.textContent = `${date} at ${time}`
    }
    form.hidden = true
    confirmation.hidden = false
  })

  dialog.addEventListener('close', showForm)
}

if (!reduceMotion) setupScrollEffects()
setupReveals()
setupNav()
setupReservation()
