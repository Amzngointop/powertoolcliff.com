'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Menu, Search } from 'lucide-react'
import { LogoMark } from './LogoMark'

type Item = { href: string; title: string }

const TOOL_PATHS = ['/tools', '/wear-point-check', '/drive-check']

function isActive(pathname: string, href: string): boolean {
  if (href === '/tools') return TOOL_PATHS.includes(pathname)
  return pathname === href || pathname.startsWith(`${href}/`)
}

const UTILITY = 'A reference on the part of a tool that wears first. This site sells nothing; product links go to Amazon.'
const SEARCH_NOTE = 'Search is not active. This is a reference, organized by department.'

/**
 * Three tiers on desktop — utility strip, logo with an inert search field,
 * departments — and one menu on mobile that holds all three. The panel is a
 * sibling of the header (R16) and closes on route change, on any link click,
 * on Escape, and on a pointerdown outside it that is not the menu button (R7).
 */
export function Header({ nav, departments }: { nav: Item[]; departments: Item[] }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [offset, setOffset] = useState(0)
  const headerRef = useRef<HTMLElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const place = () => {
      const bottom = headerRef.current?.getBoundingClientRect().bottom ?? 0
      setOffset(Math.max(0, Math.round(bottom)))
    }
    place()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node
      if (buttonRef.current?.contains(target)) return
      if (panelRef.current?.contains(target)) return
      setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, { passive: true })
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place)
    }
  }, [open])

  return (
    <>
      <header ref={headerRef} data-site-header="">
        <div className="hidden bg-carbon md:block" data-tier="1" data-utility-bar="">
          <p className="wrap py-1.5 font-narrow text-[12px] font-bold uppercase tracking-[0.08em] text-white">{UTILITY}</p>
        </div>

        <div className="border-b border-rule bg-white" data-tier="2">
          <div className="wrap flex items-center justify-between gap-6 py-3">
            <Link href="/" className="plain-link flex shrink-0 items-center gap-2.5 text-ink">
              <LogoMark />
              <span className="font-display text-[21px] font-bold tracking-tight">
                PowerTool<span className="text-blue">Cliff</span>
              </span>
            </Link>
            <div
              className="hidden min-w-0 flex-1 items-center gap-2.5 rounded-[2px] border border-rule bg-haze px-3 py-2 lg:flex"
              data-search-placeholder=""
            >
              <Search className="h-4 w-4 shrink-0 text-ink-3" aria-hidden="true" />
              <span className="truncate text-[14px] text-ink-3">{SEARCH_NOTE}</span>
            </div>
            <nav aria-label="Main" className="hidden md:block">
              <ul className="flex items-center gap-6">
                {nav.map((i) => (
                  <li key={i.href}>
                    <Link
                      href={i.href}
                      className={`label label-lg plain-link hover:text-blue ${isActive(pathname, i.href) ? '!text-blue' : '!text-ink'}`}
                      aria-current={isActive(pathname, i.href) ? 'page' : undefined}
                    >
                      {i.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <button
              ref={buttonRef}
              type="button"
              className="btn btn-secondary btn-sm md:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              <Menu className="h-4 w-4" aria-hidden="true" />
              Menu
            </button>
          </div>
          <noscript>
            <nav aria-label="Site sections without script" className="wrap flex flex-wrap gap-x-5 gap-y-1 pb-3 md:hidden">
              {[...nav, ...departments].map((i) => (
                <a key={i.href} href={i.href} className="text-link text-[14px]">
                  {i.title}
                </a>
              ))}
            </nav>
          </noscript>
        </div>

        <nav aria-label="Departments" className="hidden bg-blue md:block" data-tier="3">
          <ul className="wrap flex gap-8 overflow-x-auto">
            {departments.map((d) => (
              <li key={d.href}>
                <Link href={d.href} className="dept-link" aria-current={pathname === d.href ? 'page' : undefined}>
                  {d.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <div
        id="mobile-menu"
        ref={panelRef}
        className="mobile-panel md:hidden"
        hidden={!open}
        style={{ top: offset, height: `calc(100dvh - ${offset}px)` }}
      >
        <div className="bg-carbon">
          <p className="wrap py-2 font-narrow text-[12px] font-bold uppercase tracking-[0.06em] text-white">{UTILITY}</p>
        </div>
        <div className="wrap pt-3">
          <p className="flex items-center gap-2 rounded-[2px] border border-rule bg-haze px-3 py-2 text-[14px] text-ink-3">
            <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
            {SEARCH_NOTE}
          </p>
        </div>
        <nav aria-label="Menu" className="wrap py-3">
          <ul className="divide-y divide-rule">
            {nav.map((i) => (
              <li key={i.href}>
                <Link
                  href={i.href}
                  onClick={() => setOpen(false)}
                  className={`block py-3 font-display text-[17px] font-semibold ${isActive(pathname, i.href) ? 'text-blue' : 'text-ink'}`}
                  aria-current={isActive(pathname, i.href) ? 'page' : undefined}
                >
                  {i.title}
                </Link>
              </li>
            ))}
          </ul>
          <p className="label mt-5">Departments</p>
          <ul className="mt-1 divide-y divide-rule">
            {departments.map((d) => (
              <li key={d.href}>
                <Link
                  href={d.href}
                  onClick={() => setOpen(false)}
                  className={`block border-l-[3px] py-2.5 pl-3 text-[15px] ${pathname === d.href ? 'border-amber text-blue' : 'border-transparent text-ink'}`}
                  aria-current={pathname === d.href ? 'page' : undefined}
                >
                  {d.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  )
}
