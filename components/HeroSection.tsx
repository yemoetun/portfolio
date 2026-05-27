'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'
import Image from 'next/image'

const ICONS = [
  { label: 'Python',     src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',         x: -260, y: -140 },
  { label: 'TypeScript', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', x:  180, y: -200 },
  { label: 'Claude',     src: '/claude-logo.svg',                                                                       x: -300, y:   60 },
  { label: 'C#',         src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg',         x:  260, y:  100 },
  { label: 'Next.js',    src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',         x:  -80, y:  220 },
  { label: 'React',      src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',           x:  200, y:  190 },
  { label: 'Tableau',    src: 'https://cdn.worldvectorlogo.com/logos/tableau-software.svg',                             x: -180, y: -220 },
]

function FloatingIcon({ label, src, x, y, scrollYProgress }: {
  label: string; src: string; x: number; y: number
  scrollYProgress: MotionValue<number>
}) {
  const iconX       = useTransform(scrollYProgress, [0, 0.6], [x, 0])
  const iconY       = useTransform(scrollYProgress, [0, 0.6], [y, 0])
  const iconScale   = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const iconOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0])

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: '50%',
        top:  '50%',
        x: iconX,
        y: iconY,
        scale:   iconScale,
        opacity: iconOpacity,
        translateX: '-50%',
        translateY: '-50%',
      }}
      className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white shadow-md border border-black/5 p-2"
      title={label}
    >
      <Image
        src={src}
        alt={label}
        width={40}
        height={40}
        className="object-contain"
        style={{ filter: 'grayscale(100%)' }}
      />
    </motion.div>
  )
}

export default function HeroSection({
  initialTitle = 'Portfolio',
  initialSubtitle = '',
}: {
  initialTitle?: string
  initialSubtitle?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  return (
    <section ref={ref} className="relative h-screen flex items-center justify-center overflow-hidden bg-bone">
      {ICONS.map(({ label, src, x, y }) => (
        <FloatingIcon key={label} label={label} src={src} x={x} y={y} scrollYProgress={scrollYProgress}/>
      ))}

      <div className="relative z-10 flex flex-col items-center gap-3 select-none">
        <h1 className="text-7xl md:text-9xl font-bold tracking-tight text-matte">
          {initialTitle}
        </h1>
        {initialSubtitle && (
          <p className="text-lg text-matte/60 font-light">{initialSubtitle}</p>
        )}
      </div>
    </section>
  )
}
