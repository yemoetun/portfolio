'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function AboutSection({
  initialBio = '',
  initialPhoto = '',
}: {
  initialBio?: string
  initialPhoto?: string
}) {
  return (
    <section className="w-full min-h-[67vh] bg-matte text-bone flex flex-col px-10 py-16 md:py-24">
      <h2 className="text-3xl font-bold mb-12">About Me</h2>
      <div className="flex flex-col md:flex-row gap-10 items-start">

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex-1 text-bone/80 text-lg leading-relaxed"
        >
          <p>{initialBio || 'Add your bio in the Admin Panel.'}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-6"
        >
          <div className="w-52 h-52 rounded-full bg-bone/10 border-2 border-bone/30 overflow-hidden
                          flex items-center justify-center text-bone/40 text-sm">
            {initialPhoto
              ? <img src={initialPhoto} alt="Profile" className="w-full h-full object-cover" />
              : 'Photo'
            }
          </div>
          <Link href="/about"
            className="px-8 py-2.5 border border-bone text-bone text-sm
                       rounded-full hover:bg-bone hover:text-matte transition-colors"
          >
            Full Bio
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
