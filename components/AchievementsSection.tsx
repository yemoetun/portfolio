'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

type Achievement = {
  id: number
  title: string
  description: string
  image_url: string
  featured: boolean
}

export default function AchievementsSection({ initialAchievements = [] }: { initialAchievements?: Achievement[] }) {
  const featured = initialAchievements.find(a => a.featured) ?? initialAchievements[0] ?? null

  return (
    <section className="w-full min-h-[60vh] bg-matte text-bone flex flex-col px-10 py-16">
      <h2 className="text-3xl font-bold mb-12">Achievements</h2>

      {!featured ? (
        <p className="text-bone/40 text-sm">No achievements yet — add some in the Admin Panel.</p>
      ) : (
        <div className="flex flex-col md:flex-row gap-10 items-center">

          <div className="w-64 h-64 rounded-2xl bg-bone/10 border border-bone/20
                          flex items-center justify-center text-bone/30 text-sm shrink-0 overflow-hidden">
            {featured.image_url
              ? <img src={featured.image_url} alt={featured.title} className="w-full h-full object-cover"/>
              : 'Achievement Image'
            }
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center gap-2 w-fit px-4 py-1.5
                            bg-bone/10 border border-bone/20 rounded-full">
              <span className="w-2 h-2 rounded-full bg-green-400
                               shadow-[0_0_6px_2px_rgba(74,222,128,0.6)] animate-pulse"/>
              <span className="text-xs font-semibold text-bone/80">Featured</span>
            </div>

            <h3 className="text-xl font-bold text-bone">{featured.title}</h3>
            <p className="text-bone/80 text-lg max-w-lg leading-relaxed">{featured.description}</p>

            <Link href="/achievements"
              className="mt-2 self-start text-sm font-medium px-6 py-2 border border-bone/60
                         rounded-full hover:bg-bone hover:text-matte transition-colors"
            >
              Discover more achievements
            </Link>
          </motion.div>
        </div>
      )}
    </section>
  )
}
