'use client'
import Link from 'next/link'

export default function ContactSection() {
  return (
    <section className="w-full min-h-[33vh] bg-bone flex items-center px-10 py-16">
      <div className="flex flex-col md:flex-row items-center justify-between w-full gap-8">
        <h2 className="text-4xl md:text-5xl font-bold text-matte">
          Let's Connect
        </h2>
        <Link href="/contact"
          className="px-10 py-4 bg-matte text-bone text-sm font-semibold
                     rounded-lg hover:bg-accent transition-colors"
        >
          Get in Touch
        </Link>
      </div>
    </section>
  )
}