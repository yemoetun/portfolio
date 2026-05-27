'use client'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

type Project = {
  id: number
  title: string
  description: string
  tags: string[]
  repo_url: string
  image_url: string
}

export default function ProjectsCarousel({ initialProjects = [] }: { initialProjects?: Project[] }) {
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState(0)
  const projects = initialProjects

  if (projects.length === 0) return (
    <section className="w-full py-20 px-6 bg-bone">
      <h2 className="text-3xl font-bold text-matte mb-12">Projects</h2>
      <p className="text-matte/40 text-sm">No projects yet — add some in the Admin Panel.</p>
    </section>
  )

  const len = projects.length

  const prev = () => {
    setDirection(-1)
    setActive(i => (i - 1 + len) % len)
  }
  const next = () => {
    setDirection(1)
    setActive(i => (i + 1) % len)
  }

  const p = projects[active]

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:  (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  }

  return (
    <section className="w-full py-20 px-6 bg-bone overflow-hidden">
      <h2 className="text-3xl font-bold text-matte mb-12">Projects</h2>

      <div className="relative flex items-center justify-center">

        {len > 1 && (
          <button onClick={prev}
            className="absolute left-4 z-20 p-3 bg-matte text-bone rounded-full shadow-lg hover:bg-accent transition-colors">
            <ChevronLeft size={22}/>
          </button>
        )}

        <div className="w-full max-w-lg overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={p.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              className="bg-white rounded-2xl shadow-xl border border-black/5 p-6 flex flex-col gap-4"
              style={{ minHeight: 340 }}
            >
              <div className="h-44 rounded-xl bg-matte/5 overflow-hidden flex items-center justify-center">
                {p.image_url
                  ? <img src={p.image_url} alt={p.title} className="w-full h-full object-cover"/>
                  : <span className="text-sm text-matte/30">Project Image</span>
                }
              </div>
              <h3 className="font-bold text-xl text-matte">{p.title}</h3>
              <p className="text-sm text-accent flex-1 leading-relaxed">{p.description}</p>
              <Link href={`/projects?id=${p.id}`}
                className="self-start text-xs font-semibold px-4 py-1.5
                           border border-matte rounded-full
                           hover:bg-matte hover:text-bone transition-colors">
                Read more
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {len > 1 && (
          <button onClick={next}
            className="absolute right-4 z-20 p-3 bg-matte text-bone rounded-full shadow-lg hover:bg-accent transition-colors">
            <ChevronRight size={22}/>
          </button>
        )}
      </div>

      <div className="flex justify-center gap-2 mt-6">
        {projects.map((_, i) => (
          <button key={i} onClick={() => { setDirection(i > active ? 1 : -1); setActive(i) }}
            className={`h-2 rounded-full transition-all duration-300
              ${i === active ? 'bg-matte w-6' : 'bg-matte/25 w-2'}`}
          />
        ))}
      </div>
    </section>
  )
}
