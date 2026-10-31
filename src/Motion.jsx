import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowUpRight, Leaf } from 'lucide-react'

// The native modal handles focus containment, Escape and background accessibility.
export function MenuNavigation({ groups, page, setPage }) {
  const dialog = useRef(null)
  const trigger = useRef(null)
  const navigating = useRef(false)
  const [phase, setPhase] = useState('closed')
  const active = phase !== 'closed'

  useEffect(() => {
    if (!active) return
    const oldOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = oldOverflow }
  }, [active])

  useLayoutEffect(() => {
    const modal = dialog.current
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (phase === 'primed') {
      if (!modal.open) modal.showModal()
      // Commit the collapsed shape before expanding it on the next paint.
      modal.getBoundingClientRect()
      const frame = requestAnimationFrame(() => setPhase('opening'))
      return () => cancelAnimationFrame(frame)
    }
    if (phase === 'opening') {
      const timer = window.setTimeout(() => setPhase('open'), reduced ? 0 : 1000)
      return () => window.clearTimeout(timer)
    }
    if (phase === 'closing') {
      const timer = window.setTimeout(() => {
        modal.close()
        setPhase('closed')
        if (navigating.current) document.querySelector('.section-title h1')?.focus({ preventScroll: true })
        else trigger.current?.focus({ preventScroll: true })
        navigating.current = false
      }, reduced ? 0 : 680)
      return () => window.clearTimeout(timer)
    }
  }, [phase])

  const close = () => { if (phase !== 'closed' && phase !== 'closing') setPhase('closing') }
  const navigate = id => {
    navigating.current = true
    setPage(id)
    close()
  }

  return <>
    <button ref={trigger} className="workspace-menu-trigger" aria-label="Open workspace menu" aria-haspopup="dialog" aria-expanded={active} aria-controls="ecopulse-menu" onClick={() => { if (!active) setPhase('primed') }}>
      <span className="menu-trigger-label">Menu</span><span className={`menu-bars ${active ? 'is-open' : ''}`} aria-hidden="true"><i/><i/></span>
    </button>
    {createPortal(<dialog ref={dialog} id="ecopulse-menu" className="workspace-menu" data-phase={phase} aria-labelledby="workspace-menu-title" onCancel={event => { event.preventDefault(); close() }} onClose={() => setPhase('closed')}>
      <div className="menu-color-wipe" aria-hidden="true"/>
      <div className="menu-surface">
        <header className="menu-overlay-header"><div className="menu-overlay-brand"><span className="brand-mark"><Leaf size={22}/></span><div><b>EcoPulse</b><span>ENERGY INTELLIGENCE</span></div></div>
          <button className="workspace-menu-close" aria-label="Close workspace menu" autoFocus onClick={close}><span>Close</span><span className="menu-bars is-open" aria-hidden="true"><i/><i/></span></button>
        </header>
        <div className="menu-scroll-area">
          <div className="menu-intro"><div><p className="menu-kicker">GREENFIELD CAMPUS / WORKSPACE</p><h2 id="workspace-menu-title">One campus.<br/><em>Every possibility.</em></h2></div><p className="menu-intro-note">Explore your energy system.<br/>Choose where to go next.</p></div>
          <nav className="menu-destinations" aria-label="Workspace sections">{groups.map((group, groupIndex) => <section className="menu-group" key={group.label}>
            <h3><span>0{groupIndex + 1}</span>{group.label}</h3>
            {group.items.map(([label,id,Icon], index) => <button key={id} data-page={id} style={{ '--item-delay': `${140 + index * 65 + groupIndex * 75}ms` }} className={`menu-destination ${page === id ? 'active' : ''}`} aria-current={page === id ? 'page' : undefined} onClick={() => navigate(id)}>
              <span className="menu-link-icon"><Icon size={19}/></span><span className="menu-link-label">{label}</span>{id === 'anomalies' && <small className="menu-alert-count">2</small>}<ArrowUpRight className="menu-link-arrow" size={21}/>
            </button>)}
          </section>)}</nav>
          <footer className="menu-overlay-footer"><span><i className="live-dot"/> EcoPulse Energy Intelligence</span><span>Smarter energy. Lighter footprint.</span><span>Demo environment · Sample data</span></footer>
        </div>
        <div className="menu-edge-label" aria-hidden="true">EXPLORE ECOPULSE</div>
      </div>
    </dialog>, document.body)}
  </>
}

const revealSelector = [
  '.eyebrow', 'h1', 'h3', 'p', '.metric-top', '.metric-value', '.metric-foot',
  '.chart-legend', '.chart-summary > div', '.mix-legend > div', '.insight',
  '.table-row', '.forecast-stats > div', '.model-score', '.model-row',
  '.recommendation', '.constraint', '.battery-visual', '.battery-stats > div',
  '.dispatch-row', '.zone-row', '.load-row', '.carbon-window', '.scenario-total',
  '.telemetry-card', '.critical-row', '.duration-result', '.anomaly-row',
  '.report-row', '.method', '.note-panel', '.safe-note', '.tip-banner', '.footer'
].join(',')

// Observe actual viewport intersections, including rows added by filters and tabs.
// Offscreen text stays unrevealed until scrolling reaches it. Content reveals once per visit.
export function RevealContent({ children, ...props }) {
  const root = useRef(null)
  useLayoutEffect(() => {
    const container = root.current
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    let intersection
    let mutations
    const show = node => { node.dataset.reveal = 'shown'; intersection?.unobserve(node) }
    const setup = () => {
      intersection?.disconnect()
      mutations?.disconnect()
      if (media.matches || !('IntersectionObserver' in window)) {
        container.querySelectorAll(revealSelector).forEach(show)
        return
      }
      intersection = new IntersectionObserver(entries => {
        const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left)
        visible.forEach((entry, index) => {
          entry.target.style.setProperty('--reveal-delay', `${Math.min(index * 38, 228)}ms`)
          show(entry.target)
        })
      }, { threshold: .08, rootMargin: '0px 0px -28px 0px' })
      const register = () => container.querySelectorAll(revealSelector).forEach(node => {
        if (node.dataset.reveal === 'shown') return
        node.dataset.reveal = 'pending'
        intersection.observe(node)
      })
      register()
      mutations = new MutationObserver(register)
      mutations.observe(container, { childList: true, subtree: true })
    }
    setup()
    media.addEventListener('change', setup)
    const onFocus = event => {
      let node = event.target
      while (node && node !== container) {
        if (node.dataset?.reveal) show(node)
        node = node.parentElement
      }
    }
    container.addEventListener('focusin', onFocus)
    return () => { intersection?.disconnect(); mutations?.disconnect(); media.removeEventListener('change', setup); container.removeEventListener('focusin', onFocus) }
  }, [])
  return <div ref={root} {...props}>{children}</div>
}
