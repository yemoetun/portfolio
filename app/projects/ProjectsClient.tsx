'use client'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

type Project = {
  id: number
  title: string
  description: string
  full_description: string
  tags: string[]
  repo_url: string
  image_url: string
}

function ProjectsContent({ initialProjects }: { initialProjects: Project[] }) {
  const searchParams = useSearchParams()
  const targetId = searchParams.get('id')
  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({})

  useEffect(() => {
    if (!targetId || initialProjects.length === 0) return
    const id = parseInt(targetId)
    const el = cardRefs.current[id]
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 300)
    }
  }, [initialProjects, targetId])

  return (
    <main className="min-h-screen bg-bone px-8 pt-28 pb-20">
      <motion.h1
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-matte mb-12"
      >
        Projects
      </motion.h1>

      {initialProjects.length === 0 ? (
        <p className="text-matte/40 text-sm">No projects yet — add some in the Admin Panel.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {initialProjects.map((p, i) => {
            const isHighlighted = targetId && p.id === parseInt(targetId)
            return (
              <motion.div
                key={p.id}
                ref={el => { cardRefs.current[p.id] = el }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl overflow-hidden shadow-md border flex flex-col transition-all duration-300"
                style={{
                  borderColor: isHighlighted ? '#28282B' : 'rgba(0,0,0,0.05)',
                  boxShadow: isHighlighted ? '0 0 0 2px #28282B, 0 8px 30px rgba(0,0,0,0.15)' : '',
                }}
              >
                <div className="h-44 bg-matte/5 flex items-center justify-center text-sm text-matte/30 overflow-hidden">
                  {p.image_url
                    ? <img src={p.image_url} alt={p.title} className="w-full h-full object-cover"/>
                    : 'Project Image'
                  }
                </div>
                <div className="p-5 flex flex-col gap-3 flex-1">
                  <h3 className="font-bold text-lg text-matte">{p.title}</h3>
                  <p className="text-sm text-accent flex-1">{p.full_description || p.description}</p>
                  <div className="flex items-end justify-between mt-2">
                    <div className="flex gap-2 flex-wrap">
                      {(Array.isArray(p.tags) ? p.tags : []).map(t => (
                        <span key={t} className="text-xs px-2.5 py-1 rounded-full
                                                 bg-matte/5 text-matte/60 border border-matte/10">
                          {t}
                        </span>
                      ))}
                    </div>
                    {p.repo_url && (
                      <Link href={p.repo_url} target="_blank"
                        className="text-xs font-semibold px-4 py-1.5 bg-matte text-bone
                                   rounded-full hover:bg-accent transition-colors"
                      >
                        GitHub →
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </main>
  )
}

export default function ProjectsClient({ initialProjects }: { initialProjects: Project[] }) {
  return (
    <Suspense>
      <ProjectsContent initialProjects={initialProjects} />
    </Suspense>
  )
}
