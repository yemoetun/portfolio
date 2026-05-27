'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

type Achievement = {
  id: number
  title: string
  description: string
  full_description: string
  image_url: string
  featured: boolean
}

export default function AchievementsClient({ initialAchievements }: { initialAchievements: Achievement[] }) {
  const [selected, setSelected] = useState<number | null>(null)
  const active = initialAchievements.find(a => a.id === selected)

  return (
    <main className="min-h-screen bg-bone px-8 pt-28 pb-20">
      <h1 className="text-4xl font-bold text-matte mb-12">Achievements</h1>

      {initialAchievements.length === 0 ? (
        <p className="text-matte/40 text-sm">No achievements yet — add some in the Admin Panel.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {initialAchievements.map(a => (
            <motion.div key={a.id} layoutId={`card-${a.id}`}
              onClick={() => setSelected(a.id)}
              className="bg-white rounded-2xl p-6 shadow-md border border-black/5 cursor-pointer
                         hover:shadow-lg transition-shadow"
            >
              <div className="h-36 bg-matte/5 rounded-xl mb-4 flex items-center justify-center
                             text-sm text-matte/30 overflow-hidden">
                {a.image_url
                  ? <img src={a.image_url} alt={a.title} className="w-full h-full object-cover"/>
                  : 'Image'
                }
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-lg text-matte">{a.title}</h3>
                {a.featured && (
                  <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"/>
                    Featured
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {active && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              onClick={() => setSelected(null)}
            />
            <motion.div layoutId={`card-${active.id}`}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                         z-50 w-full max-w-2xl bg-white rounded-3xl p-10 shadow-2xl"
            >
              <button onClick={() => setSelected(null)}
                className="absolute top-5 right-5 text-matte/40 hover:text-matte">
                <X size={20}/>
              </button>
              {active.image_url && (
                <img src={active.image_url} alt={active.title}
                  className="w-full h-56 object-cover rounded-2xl mb-6"/>
              )}
              <h2 className="text-2xl font-bold text-matte mb-4">{active.title}</h2>
              <p className="text-accent leading-relaxed">{active.full_description || active.description}</p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  )
}
