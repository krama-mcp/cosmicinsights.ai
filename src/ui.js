export function initUI() {
  const ui = document.getElementById('ui')

  const logo = document.createElement('div')
  logo.id = 'logo'
  logo.textContent = 'COSMICINSIGHTS.AI'
  Object.assign(logo.style, {
    position: 'absolute',
    top: '40px',
    left: '50%',
    transform: 'translateX(-50%)',
    color: 'rgba(255,255,255,0.9)',
    fontSize: 'clamp(14px, 2vw, 20px)',
    letterSpacing: '0.3em',
    fontWeight: '300',
  })
  ui.appendChild(logo)

  const hint = document.createElement('div')
  hint.id = 'scroll-hint'
  hint.textContent = 'Scroll to begin your journey'
  Object.assign(hint.style, {
    position: 'absolute',
    bottom: '40px',
    left: '50%',
    transform: 'translateX(-50%)',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '13px',
    letterSpacing: '0.2em',
    fontWeight: '300',
    animation: 'pulse 2s ease-in-out infinite',
  })
  ui.appendChild(hint)

  const style = document.createElement('style')
  style.textContent = '@keyframes pulse { 0%,100%{opacity:.5} 50%{opacity:1} }'
  document.head.appendChild(style)

  // Question text (shown at chapter 7)
  const question = document.createElement('div')
  question.id = 'question-text'

  const line1 = document.createElement('div')
  line1.textContent = 'The journey continues.'
  const line2 = document.createElement('span')
  line2.textContent = 'But who is the walker?'
  Object.assign(line2.style, { fontSize: '0.7em', opacity: '0.6', letterSpacing: '0.15em' })
  question.append(line1, line2)

  Object.assign(question.style, {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    color: 'rgba(255,255,255,0)',
    fontSize: 'clamp(18px, 3vw, 36px)',
    fontWeight: '300',
    letterSpacing: '0.08em',
    lineHeight: '1.6',
    transition: 'color 2s ease',
  })
  ui.appendChild(question)

  // CTA button
  const cta = document.createElement('a')
  cta.id = 'cta-button'
  cta.href = '#'
  cta.textContent = 'Begin your inquiry \u2192'
  Object.assign(cta.style, {
    position: 'absolute',
    bottom: '80px',
    left: '50%',
    transform: 'translateX(-50%)',
    color: 'rgba(255,255,255,0)',
    fontSize: '14px',
    letterSpacing: '0.25em',
    fontWeight: '300',
    textDecoration: 'none',
    borderBottom: '1px solid rgba(255,255,255,0)',
    paddingBottom: '4px',
    transition: 'color 2s ease, border-color 2s ease',
    pointerEvents: 'none',
  })
  ui.appendChild(cta)

  // Visible state styles
  const extraStyle = document.createElement('style')
  extraStyle.textContent = `
    #question-text.visible { color: rgba(255,255,255,0.85) !important; }
    #cta-button.visible {
      color: rgba(255,255,255,0.7) !important;
      border-color: rgba(255,255,255,0.4) !important;
      pointer-events: auto !important;
      cursor: pointer;
    }
    #cta-button.visible:hover { color: #fff !important; }
  `
  document.head.appendChild(extraStyle)
}
