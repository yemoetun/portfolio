'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, User, GitBranch, Trophy, Phone, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { icon: Home,      label: 'Home',        href: '/'             },
  { icon: User,      label: 'About Me',    href: '/about'        },
  { icon: GitBranch, label: 'Projects',    href: '/projects'     },
  { icon: Trophy,    label: 'Achievements',href: '/achievements' },
  { icon: Phone,     label: 'Contact',     href: '/contact'      },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [hovered, setHovered]   = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <>
      {/* ── TOP BAR ── */}
      <AnimatePresence>
        {!scrolled && (
          <motion.nav
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5"
          >
            <Link href="/" className="font-bold text-xl tracking-wider text-matte hover:opacity-70 transition-opacity">
              Y
            </Link>
            <button onClick={() => setMenuOpen(o => !o)}>
              {menuOpen ? <X size={22}/> : <Menu size={22}/>}
            </button>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* ── SCROLLED: liquid glass island ── */}
      <AnimatePresence>
        {scrolled && (
          <motion.div
            initial={{ y: -60, opacity: 0, scale: 0.8 }}
            animate={{ y: 0,   opacity: 1, scale: 1   }}
            exit={{    y: -60, opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50
                       flex items-center gap-3 px-5 py-2.5 rounded-full
                       backdrop-blur-xl bg-white/20 border border-white/30
                       shadow-lg shadow-black/10"
          >
            <Link href="/" className="font-bold text-sm text-matte mr-1 hover:opacity-70 transition-opacity">
              Y
            </Link>
            <button onClick={() => setMenuOpen(o => !o)}>
              {menuOpen ? <X size={18}/> : <Menu size={18}/>}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── DROPDOWN MENU ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0   }}
            exit={{    opacity: 0, y: -10 }}
            className={`fixed z-40 flex
              ${scrolled
                ? 'top-16 left-1/2 -translate-x-1/2 flex-row gap-4 px-6 py-3 rounded-full backdrop-blur-xl bg-white/20 border border-white/30'
                : 'top-16 right-6 flex-col gap-5 px-5 py-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20'
              }`}
          >
            {navItems.map(({ icon: Icon, label, href }) => {
              const active = isActive(href)
              return (
                <Link
                  key={label}
                  href={href}
                  className="relative flex items-center justify-center"
                  onMouseEnter={() => setHovered(label)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setMenuOpen(false)}
                >
                  <Icon
                    size={20}
                    className="transition-all duration-200"
                    style={{
                      color: active ? '#28282B' : 'rgba(40,40,43,0.4)',
                      filter: active ? 'drop-shadow(0 0 6px rgba(40,40,43,0.5))' : 'none',
                      transform: hovered === label ? 'scale(1.15)' : 'scale(1)',
                    }}
                  />
                  {/* Active dot */}
                  {active && (
                    <span
                      className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ backgroundColor: '#28282B' }}
                    />
                  )}
                  {hovered === label && (
                    <motion.span
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x:  8 }}
                      className="absolute left-full ml-2 whitespace-nowrap
                                 text-xs font-medium text-matte bg-white/80
                                 backdrop-blur-sm px-2 py-1 rounded-md shadow"
                    >
                      {label}
                    </motion.span>
                  )}
                </Link>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
