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
}
