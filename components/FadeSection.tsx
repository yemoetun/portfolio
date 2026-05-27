'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function FadeSection({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // Fade out and scale down slightly as section scrolls away
  const opacity = useTransform(scrollYProgress, [0.6, 1], [1, 0])
  const scale   = useTransform(scrollYProgress, [0.6, 1], [1, 0.95])

  return (
    <motion.div ref={ref} style={{ opacity, scale }} className="will-change-transform">
      {children}
    </motion.div>
  )
}
