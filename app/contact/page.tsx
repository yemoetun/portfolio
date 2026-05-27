'use client'
import { useState } from 'react'

const FORMSPREE_URL = 'https://formspree.io/f/xkoyyvqb'  // ← replace with your actual form URL

export default function ContactPage() {
  const [status, setStatus] = useState<'idle'|'sending'|'sent'|'error'>('idle')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('sending')
    const data = new FormData(e.currentTarget)
    const res  = await fetch(FORMSPREE_URL, {
      method: 'POST', body: data, headers: { Accept: 'application/json' }
    })
    setStatus(res.ok ? 'sent' : 'error')
  }

  return (
    <main className="min-h-screen bg-bone px-8 pt-28 pb-20">
      <h1 className="text-4xl font-bold text-matte mb-12">Contact</h1>
      <div className="flex flex-col md:flex-row gap-16 items-start">

        {/* Contact form */}
        <form onSubmit={handleSubmit}
          className="flex-1 bg-matte rounded-2xl p-8 flex flex-col gap-5">
          <input name="name"    placeholder="Name"    required
            className="bg-white/10 text-bone placeholder-bone/40 rounded-lg px-4 py-3 outline-none"/>
          <input name="email"   placeholder="Email"   type="email" required
            className="bg-white/10 text-bone placeholder-bone/40 rounded-lg px-4 py-3 outline-none"/>
          <input name="subject" placeholder="Subject" required
            className="bg-white/10 text-bone placeholder-bone/40 rounded-lg px-4 py-3 outline-none"/>
          <textarea name="message" placeholder="Message" rows={5} required
            className="bg-white/10 text-bone placeholder-bone/40 rounded-lg px-4 py-3 outline-none resize-none"/>
          <button type="submit"
            className="bg-bone text-matte font-semibold py-3 rounded-lg hover:bg-white transition-colors">
            {status === 'sending' ? 'Sending…' : status === 'sent' ? 'Sent ✓' : 'Send Message'}
          </button>
          {status === 'error' && <p className="text-red-400 text-sm">Something went wrong. Try again.</p>}
        </form>

        {/* Social links */}
        <div className="flex flex-col gap-6 pt-4">
          <a href="https://github.com/yemoetun" target="_blank"
             className="flex items-center gap-3 text-matte hover:opacity-60 transition-opacity font-medium">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/ye-moe-tun/" target="_blank"
             className="flex items-center gap-3 text-matte hover:opacity-60 transition-opacity font-medium">
            LinkedIn
          </a>
          <a href="mailto:yemoetun0@gmail.com"
             className="flex items-center gap-3 text-matte hover:opacity-60 transition-opacity font-medium">
            Email
          </a>
        </div>
      </div>
    </main>
  )
}