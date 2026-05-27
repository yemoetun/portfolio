'use client'
import { useState } from 'react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [pw, setPw]     = useState('')
  const [auth, setAuth] = useState(false)
  const [err, setErr]   = useState(false)

  const check = async () => {
    const res = await fetch('/api/admin-auth', {
      method: 'POST',
      body: JSON.stringify({ password: pw }),
      headers: { 'Content-Type': 'application/json' },
    })
    if (res.ok) setAuth(true)
    else setErr(true)
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') check()
  }

  if (!auth) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#28282B' }}>
      <div className="rounded-2xl p-10 flex flex-col gap-4 w-80" style={{ backgroundColor: '#F9F6EE' }}>
        <h2 className="font-bold text-xl" style={{ color: '#28282B' }}>Admin Login</h2>
        <input
          type="password"
          value={pw}
          onChange={e => setPw(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Password"
          className="rounded-lg px-4 py-2 outline-none"
          style={{ border: '1px solid rgba(40,40,43,0.2)' }}
        />
        {err && <p className="text-red-500 text-sm">Incorrect password.</p>}
        <button
          onClick={check}
          className="rounded-lg py-2 transition-colors"
          style={{ backgroundColor: '#28282B', color: '#F9F6EE' }}
        >
          Login
        </button>
      </div>
    </div>
  )

  return <>{children}</>
}
