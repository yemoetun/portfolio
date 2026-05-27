'use client'
import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'

export default function AboutClient({
  initialBio = '',
  initialHardSkills = '',
  initialSoftSkills = '',
  initialLanguages = '',
  initialPhoto = '',
}: {
  initialBio?: string
  initialHardSkills?: string
  initialSoftSkills?: string
  initialLanguages?: string
  initialPhoto?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [circleGone, setCircleGone] = useState(false)
  const [showPhoto, setShowPhoto]   = useState(true)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setCircleGone(v > 0.35)
    setShowPhoto(v < 0.08)
  })

  const circleScale  = useTransform(scrollYProgress, [0, 0.3], [1, 30])
  const bgColor      = useTransform(scrollYProgress, [0, 0.2], ['#F9F6EE', '#28282B'])
  const textOpacity  = useTransform(scrollYProgress, [0.7, 1.0], [0, 1])
  const textY        = useTransform(scrollYProgress, [0.7, 1.0], [40, 0])
  const scrollHintOp = useTransform(scrollYProgress, [0, 0.05], [1, 0])

  const skills = [
    { title: 'Hard Skills', body: initialHardSkills },
    { title: 'Soft Skills', body: initialSoftSkills },
    { title: 'Languages',   body: initialLanguages  },
  ]

  return (
    <div ref={ref} className="relative h-[200vh]">
      <motion.div style={{ backgroundColor: bgColor }} className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">

        {!circleGone && (
          <motion.div
            style={{ scale: circleScale, backgroundColor: '#28282B' }}
            className="absolute w-56 h-56 rounded-full origin-center"
          />
        )}

        {showPhoto && (
          <div
            className="absolute w-56 h-56 rounded-full z-20 overflow-hidden flex items-center justify-center text-sm"
            style={{ border: '2px solid rgba(249,246,238,0.35)', color: 'rgba(249,246,238,0.4)' }}
          >
            {initialPhoto
              ? <img src={initialPhoto} alt="Profile" className="w-full h-full object-cover" />
              : 'Your Photo'
            }
          </div>
        )}

        {/* Scroll hint */}
        <motion.div
          style={{ opacity: scrollHintOp, top: 'calc(50% + 148px)' }}
          className="absolute z-20 flex flex-col items-center gap-2"
        >
          <span className="text-xs tracking-widest uppercase" style={{ color: '#28282B' }}>
            scroll down
          </span>
          <motion.svg
            width="16" height="20" viewBox="0 0 16 20" fill="none"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <path d="M8 0 L8 14 M2 8 L8 14 L14 8" stroke="#28282B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </motion.svg>
        </motion.div>

        <motion.div
          style={{ opacity: textOpacity, y: textY }}
          className="absolute z-30 w-full max-w-6xl px-16 flex flex-row gap-16 items-start"
        >
          <div className="flex-1 min-w-0">
            <h2 className="text-3xl font-bold mb-6" style={{ color: '#F9F6EE' }}>
              About Me
            </h2>
            <p className="leading-relaxed" style={{ color: 'rgba(249,246,238,0.8)' }}>
              {initialBio || 'Add your bio in the Admin Panel.'}
            </p>
          </div>

          <div className="flex flex-col gap-4 w-80 shrink-0">
            {skills.map(({ title, body }) => (
              <div key={title} style={{
                backgroundColor: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(249,246,238,0.12)',
                borderRadius: '16px',
                padding: '18px 20px',
              }}>
                <h3 className="font-semibold mb-2 text-xs uppercase tracking-widest"
                    style={{ color: '#F9F6EE' }}>
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(249,246,238,0.7)' }}>
                  {body || '—'}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
