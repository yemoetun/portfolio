'use client'
import { useState, useEffect, useRef } from 'react'
import { signOut } from 'next-auth/react'
// next-auth v4

/* ─── helpers ───────────────────────────────────────────── */
const input = "rounded-lg px-4 py-2 outline-none text-sm w-full"
const inputStyle = { border: '1px solid rgba(40,40,43,0.2)', color: '#28282B' }
const btn = (active = true) => ({
  backgroundColor: active ? '#28282B' : 'rgba(40,40,43,0.08)',
  color: active ? '#F9F6EE' : '#28282B',
})

/* ─── Root ──────────────────────────────────────────────── */
export default function AdminPage() {
  const [page, setPage] = useState<'home' | 'pages'>('home')
  const [homeTab, setHomeTab] = useState<'hero' | 'about' | 'projects' | 'achievements'>('hero')

  return (
    <main className="min-h-screen px-8 pt-16 pb-20" style={{ backgroundColor: '#F9F6EE' }}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold" style={{ color: '#28282B' }}>Admin Panel</h1>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-70"
          style={{ backgroundColor: 'rgba(40,40,43,0.08)', color: '#28282B' }}
        >
          Sign out
        </button>
      </div>

      {/* Top nav: Home / Pages */}
      <div className="flex gap-3 mb-8">
        {(['home', 'pages'] as const).map(p => (
          <button key={p} onClick={() => setPage(p)}
            className="px-7 py-2.5 rounded-full text-sm font-semibold transition-colors"
            style={btn(page === p)}>
            {p === 'home' ? 'Home Page' : 'Separate Pages'}
          </button>
        ))}
      </div>

      {page === 'home' && (
        <>
          {/* Sub-tabs for Home sections */}
          <div className="flex gap-2 mb-8 border-b pb-4" style={{ borderColor: 'rgba(40,40,43,0.1)' }}>
            {(['hero', 'about', 'projects', 'achievements'] as const).map(t => (
              <button key={t} onClick={() => setHomeTab(t)}
                className="px-5 py-1.5 rounded-full text-sm transition-colors"
                style={{
                  backgroundColor: homeTab === t ? '#28282B' : 'transparent',
                  color: homeTab === t ? '#F9F6EE' : 'rgba(40,40,43,0.6)',
                  border: homeTab === t ? 'none' : '1px solid rgba(40,40,43,0.15)',
                }}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {homeTab === 'hero'         && <HomeHeroEditor />}
          {homeTab === 'about'        && <HomeAboutEditor />}
          {homeTab === 'projects'     && <HomeProjectsEditor />}
          {homeTab === 'achievements' && <HomeAchievementsEditor />}
        </>
      )}

      {page === 'pages' && <PagesEditor />}
    </main>
  )
}

/* ══════════════════════════════════════════════════════════
   HOME — HERO
══════════════════════════════════════════════════════════ */
function HomeHeroEditor() {
  const keys = ['hero_title', 'hero_subtitle', 'nav_name']
  const labels: Record<string, string> = {
    hero_title:    'Hero Title (big text)',
    hero_subtitle: 'Hero Subtitle (small line under title)',
    nav_name:      'Navbar Initial / Name',
  }
  return <ContentFields keys={keys} labels={labels} />
}

/* ══════════════════════════════════════════════════════════
   HOME — ABOUT
══════════════════════════════════════════════════════════ */
function HomeAboutEditor() {
  const keys = ['about_short', 'hard_skills', 'soft_skills', 'languages']
  const labels: Record<string, string> = {
    about_short: 'Short Bio (shown on Home page)',
    hard_skills: 'Hard Skills',
    soft_skills: 'Soft Skills',
    languages:   'Languages',
  }
  return (
    <div className="flex flex-col gap-10 max-w-2xl">
      <PhotoUploader
        label="Home Page Photo (shown in About Me section on Home)"
        contentKey="home_photo"
      />
      <ContentFields keys={keys} labels={labels} />
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   HOME — PROJECTS  (teaser + link control per project)
══════════════════════════════════════════════════════════ */
function HomeProjectsEditor() {
  const [projects, setProjects] = useState<any[]>([])
  const [editing, setEditing]   = useState<any | null>(null)
  const [saved, setSaved]       = useState(false)

  useEffect(() => { fetch('/api/projects').then(r => r.json()).then(setProjects) }, [])

  const save = async () => {
    await fetch('/api/projects', {
      method: 'PATCH',
      body: JSON.stringify({
        id: editing.id,
        title:            editing.title,
        description:      editing.description,       // teaser shown on Home
        full_description: editing.full_description,
        tags:             Array.isArray(editing.tags) ? editing.tags : editing.tags.split(',').map((t:string)=>t.trim()).filter(Boolean),
        repo_url:         editing.repo_url,
        image_url:        editing.image_url,
      }),
      headers: { 'Content-Type': 'application/json' },
    })
    const updated = await fetch('/api/projects').then(r => r.json())
    setProjects(updated)
    setEditing(updated.find((p:any) => p.id === editing.id))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (projects.length === 0)
    return <p className="text-sm" style={{ color: 'rgba(40,40,43,0.4)' }}>No projects yet — add them in Separate Pages first.</p>

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <p className="text-sm" style={{ color: 'rgba(40,40,43,0.5)' }}>
        Select a project to edit what appears on the Home page carousel.
      </p>

      {/* Project selector */}
      <div className="flex flex-wrap gap-2">
        {projects.map(p => (
          <button key={p.id} onClick={() => setEditing({...p, tags: Array.isArray(p.tags) ? p.tags.join(', ') : p.tags})}
            className="px-4 py-1.5 rounded-full text-sm transition-colors"
            style={{
              backgroundColor: editing?.id === p.id ? '#28282B' : 'rgba(40,40,43,0.08)',
              color: editing?.id === p.id ? '#F9F6EE' : '#28282B',
            }}>
            {p.title}
          </button>
        ))}
      </div>

      {editing && (
        <div className="rounded-2xl p-6 flex flex-col gap-4"
          style={{ backgroundColor: 'white', border: '1px solid rgba(40,40,43,0.08)' }}>
          <h3 className="font-semibold text-sm" style={{ color: '#28282B' }}>
            Editing: <span style={{ color: '#3B82F6' }}>{editing.title}</span>
          </h3>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(40,40,43,0.5)' }}>
              Home Teaser (short, shown on carousel)
            </label>
            <textarea rows={3} value={editing.description ?? ''}
              onChange={e => setEditing((v:any) => ({...v, description: e.target.value}))}
              className={input} style={inputStyle}/>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(40,40,43,0.5)' }}>
              "Read More" Link — where does the button go?
            </label>
            <select value={editing.link_mode ?? 'page'}
              onChange={e => setEditing((v:any) => ({...v, link_mode: e.target.value}))}
              className={input} style={inputStyle}>
              <option value="page">→ Go to separate Projects page</option>
              <option value="repo">→ Go to GitHub / external URL</option>
            </select>
          </div>

          {(editing.link_mode === 'repo' || (!editing.link_mode && editing.repo_url)) && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(40,40,43,0.5)' }}>GitHub / External URL</label>
              <input value={editing.repo_url ?? ''} placeholder="https://github.com/..."
                onChange={e => setEditing((v:any) => ({...v, repo_url: e.target.value}))}
                className={input} style={inputStyle}/>
            </div>
          )}

          <div className="flex items-center gap-3 mt-2">
            <button onClick={save}
              className="px-6 py-2 rounded-full text-sm" style={btn()}>
              Save
            </button>
            {saved && <span className="text-green-600 text-sm">Saved!</span>}
          </div>
        </div>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   HOME — ACHIEVEMENTS  (teaser + link control)
══════════════════════════════════════════════════════════ */
function HomeAchievementsEditor() {
  const [achievements, setAchievements] = useState<any[]>([])
  const [editing, setEditing]           = useState<any | null>(null)
  const [saved, setSaved]               = useState(false)

  useEffect(() => { fetch('/api/achievements').then(r => r.json()).then(setAchievements) }, [])

  const save = async () => {
    await fetch('/api/achievements', {
      method: 'PATCH',
      body: JSON.stringify({
        id:               editing.id,
        title:            editing.title,
        description:      editing.description,
        full_description: editing.full_description,
        image_url:        editing.image_url,
        featured:         editing.featured,
      }),
      headers: { 'Content-Type': 'application/json' },
    })
    const updated = await fetch('/api/achievements').then(r => r.json())
    setAchievements(updated)
    setEditing(updated.find((a:any) => a.id === editing.id))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (achievements.length === 0)
    return <p className="text-sm" style={{ color: 'rgba(40,40,43,0.4)' }}>No achievements yet — add them in Separate Pages first.</p>

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <p className="text-sm" style={{ color: 'rgba(40,40,43,0.5)' }}>
        Select an achievement to edit what appears on the Home page.
      </p>

      <div className="flex flex-wrap gap-2">
        {achievements.map(a => (
          <button key={a.id} onClick={() => setEditing({...a})}
            className="px-4 py-1.5 rounded-full text-sm transition-colors"
            style={{
              backgroundColor: editing?.id === a.id ? '#28282B' : 'rgba(40,40,43,0.08)',
              color: editing?.id === a.id ? '#F9F6EE' : '#28282B',
            }}>
            {a.title}
          </button>
        ))}
      </div>

      {editing && (
        <div className="rounded-2xl p-6 flex flex-col gap-4"
          style={{ backgroundColor: 'white', border: '1px solid rgba(40,40,43,0.08)' }}>
          <h3 className="font-semibold text-sm" style={{ color: '#28282B' }}>
            Editing: <span style={{ color: '#3B82F6' }}>{editing.title}</span>
          </h3>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(40,40,43,0.5)' }}>
              Home Teaser (short description shown on Home)
            </label>
            <textarea rows={3} value={editing.description ?? ''}
              onChange={e => setEditing((v:any) => ({...v, description: e.target.value}))}
              className={input} style={inputStyle}/>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(40,40,43,0.5)' }}>
              "Discover More" Link — where does the button go?
            </label>
            <select value={editing.link_mode ?? 'page'}
              onChange={e => setEditing((v:any) => ({...v, link_mode: e.target.value}))}
              className={input} style={inputStyle}>
              <option value="page">→ Go to separate Achievements page</option>
              <option value="external">→ Go to external URL</option>
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={editing.featured ?? false}
              onChange={e => setEditing((v:any) => ({...v, featured: e.target.checked}))}
              className="w-4 h-4"/>
            <span className="text-sm" style={{ color: '#28282B' }}>Show as Featured on Home</span>
          </label>

          <div className="flex items-center gap-3 mt-2">
            <button onClick={save} className="px-6 py-2 rounded-full text-sm" style={btn()}>Save</button>
            {saved && <span className="text-green-600 text-sm">Saved!</span>}
          </div>
        </div>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   SEPARATE PAGES EDITOR
══════════════════════════════════════════════════════════ */
function PagesEditor() {
  const [pagesTab, setPagesTab] = useState<'about' | 'projects' | 'achievements'>('about')

  return (
    <div>
      <div className="flex gap-2 mb-8 border-b pb-4" style={{ borderColor: 'rgba(40,40,43,0.1)' }}>
        {(['about', 'projects', 'achievements'] as const).map(t => (
          <button key={t} onClick={() => setPagesTab(t)}
            className="px-5 py-1.5 rounded-full text-sm transition-colors"
            style={{
              backgroundColor: pagesTab === t ? '#28282B' : 'transparent',
              color: pagesTab === t ? '#F9F6EE' : 'rgba(40,40,43,0.6)',
              border: pagesTab === t ? 'none' : '1px solid rgba(40,40,43,0.15)',
            }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {pagesTab === 'about'        && <PagesAboutEditor />}
      {pagesTab === 'projects'     && <PagesProjectsEditor />}
      {pagesTab === 'achievements' && <PagesAchievementsEditor />}
    </div>
  )
}

function PagesAboutEditor() {
  const keys = ['about_full', 'hard_skills', 'soft_skills', 'languages']
  const labels: Record<string, string> = {
    about_full:  'Full Biography (About page)',
    hard_skills: 'Hard Skills',
    soft_skills: 'Soft Skills',
    languages:   'Languages',
  }
  return (
    <div className="flex flex-col gap-10 max-w-2xl">
      <PhotoUploader
        label="About Page Photo (shown inside the circle on the About page)"
        contentKey="about_photo"
      />
      <ContentFields keys={keys} labels={labels} />
    </div>
  )
}

function PagesProjectsEditor() {
  return <FullItemEditor type="projects" />
}

function PagesAchievementsEditor() {
  return <FullItemEditor type="achievements" />
}

/* ══════════════════════════════════════════════════════════
   SHARED: Full item editor (add / edit / delete with
   full_description field)
══════════════════════════════════════════════════════════ */
const EMPTY_PROJECT     = { title: '', description: '', full_description: '', tags: '', repo_url: '', image_url: '' }
const EMPTY_ACHIEVEMENT = { title: '', description: '', full_description: '', image_url: '', featured: false }

function FullItemEditor({ type }: { type: 'projects' | 'achievements' }) {
  const isProj = type === 'projects'
  const [items, setItems]         = useState<any[]>([])
  const [form, setForm]           = useState<any>(isProj ? EMPTY_PROJECT : EMPTY_ACHIEVEMENT)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [uploading, setUploading] = useState(false)
  const [saved, setSaved]         = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const load = () => fetch(`/api/${type}`).then(r => r.json()).then(setItems)
  useEffect(() => { load() }, [])

  const uploadImage = async (file: File) => {
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const { url } = await res.json()
    setForm((v: any) => ({ ...v, image_url: url }))
    setUploading(false)
  }

  const startEdit = (item: any) => {
    setEditingId(item.id)
    setForm({
      ...item,
      tags: isProj ? (Array.isArray(item.tags) ? item.tags.join(', ') : item.tags) : undefined,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancel = () => { setEditingId(null); setForm(isProj ? EMPTY_PROJECT : EMPTY_ACHIEVEMENT) }

  const submit = async () => {
    if (!form.title || !form.description) return
    const payload = isProj
      ? { ...form, tags: form.tags.split(',').map((t: string) => t.trim()).filter(Boolean) }
      : form

    await fetch(`/api/${type}`, {
      method: editingId !== null ? 'PATCH' : 'POST',
      body: JSON.stringify(editingId !== null ? { id: editingId, ...payload } : payload),
      headers: { 'Content-Type': 'application/json' },
    })
    setEditingId(null)
    setForm(isProj ? EMPTY_PROJECT : EMPTY_ACHIEVEMENT)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    load()
  }

  const del = async (id: number) => {
    if (!confirm(`Delete this ${isProj ? 'project' : 'achievement'}?`)) return
    await fetch(`/api/${type}`, {
      method: 'DELETE',
      body: JSON.stringify({ id }),
      headers: { 'Content-Type': 'application/json' },
    })
    load()
  }

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      {/* Form */}
      <div className="rounded-2xl p-6 flex flex-col gap-3"
        style={{ backgroundColor: 'white', border: `1px solid ${editingId ? 'rgba(59,130,246,0.4)' : 'rgba(40,40,43,0.08)'}` }}>
        <h3 className="font-semibold text-sm uppercase tracking-widest" style={{ color: '#28282B' }}>
          {editingId ? `✏️ Editing ${isProj ? 'Project' : 'Achievement'}` : `Add New ${isProj ? 'Project' : 'Achievement'}`}
        </h3>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(40,40,43,0.5)' }}>Title</label>
          <input placeholder={isProj ? 'Project title' : 'Achievement title'}
            value={form.title} onChange={e => setForm((v:any) => ({...v, title: e.target.value}))}
            className={input} style={inputStyle}/>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(40,40,43,0.5)' }}>
            Short Description (shown on Home page teaser)
          </label>
          <textarea rows={2} placeholder="Brief teaser for the Home page..."
            value={form.description} onChange={e => setForm((v:any) => ({...v, description: e.target.value}))}
            className={`${input} resize-none`} style={inputStyle}/>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(40,40,43,0.5)' }}>
            Full Description (shown on {isProj ? 'Projects' : 'Achievements'} page)
          </label>
          <textarea rows={5} placeholder="Complete write-up for the separate page..."
            value={form.full_description ?? ''} onChange={e => setForm((v:any) => ({...v, full_description: e.target.value}))}
            className={`${input} resize-none`} style={inputStyle}/>
        </div>

        {isProj && (
          <>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(40,40,43,0.5)' }}>Tags (comma-separated)</label>
              <input placeholder="Python, SQL, Tableau"
                value={form.tags ?? ''} onChange={e => setForm((v:any) => ({...v, tags: e.target.value}))}
                className={input} style={inputStyle}/>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(40,40,43,0.5)' }}>GitHub / External URL</label>
              <input placeholder="https://github.com/..."
                value={form.repo_url ?? ''} onChange={e => setForm((v:any) => ({...v, repo_url: e.target.value}))}
                className={input} style={inputStyle}/>
            </div>
          </>
        )}

        {!isProj && (
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.featured ?? false}
              onChange={e => setForm((v:any) => ({...v, featured: e.target.checked}))}
              className="w-4 h-4"/>
            <span className="text-sm" style={{ color: '#28282B' }}>Mark as Featured (shown on Home)</span>
          </label>
        )}

        {/* Image upload */}
        <div className="flex items-center gap-3">
          <button onClick={() => fileRef.current?.click()}
            className="px-4 py-2 rounded-lg text-sm"
            style={{ border: '1px solid rgba(40,40,43,0.2)', color: '#28282B' }}>
            {uploading ? 'Uploading…' : form.image_url ? 'Change Image' : 'Upload Image'}
          </button>
          {form.image_url && <span className="text-xs text-green-600">Image ready ✓</span>}
          <input ref={fileRef} type="file" accept="image/*" className="hidden"
            onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0])}/>
        </div>

        <div className="flex items-center gap-3 mt-1">
          <button onClick={submit} className="px-6 py-2 rounded-full text-sm" style={btn()}>
            {editingId ? 'Save Changes' : `Add ${isProj ? 'Project' : 'Achievement'}`}
          </button>
          {editingId && (
            <button onClick={cancel} className="px-6 py-2 rounded-full text-sm"
              style={{ border: '1px solid rgba(40,40,43,0.2)', color: '#28282B' }}>
              Cancel
            </button>
          )}
          {saved && <span className="text-green-600 text-sm">Saved!</span>}
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {items.length === 0 && <p className="text-sm" style={{ color: 'rgba(40,40,43,0.4)' }}>Nothing added yet.</p>}
        {items.map((item: any) => (
          <div key={item.id} className="rounded-xl px-5 py-3"
            style={{
              backgroundColor: editingId === item.id ? 'rgba(59,130,246,0.05)' : 'white',
              border: editingId === item.id ? '1px solid rgba(59,130,246,0.3)' : '1px solid rgba(40,40,43,0.08)',
            }}>
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0 mr-4">
                <p className="font-medium text-sm" style={{ color: '#28282B' }}>
                  {item.title}
                  {!isProj && item.featured && <span className="ml-2 text-xs text-green-600">● Featured</span>}
                </p>
                <p className="text-xs mt-0.5 truncate" style={{ color: 'rgba(40,40,43,0.5)' }}>
                  {item.description}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button onClick={() => startEdit(item)} className="text-sm font-medium" style={{ color: '#3B82F6' }}>Edit</button>
                <button onClick={() => del(item.id)} className="text-sm font-medium text-red-500 hover:text-red-700">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   SHARED: PhotoUploader
══════════════════════════════════════════════════════════ */
function PhotoUploader({ label, contentKey }: { label: string; contentKey: string }) {
  const [currentUrl, setCurrentUrl] = useState('')
  const [uploading, setUploading]   = useState(false)
  const [saved, setSaved]           = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch(`/api/content?key=${contentKey}`).then(r => r.json()).then(d => {
      if (d.value) setCurrentUrl(d.value)
    })
  }, [contentKey])

  const upload = async (file: File) => {
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const { url } = await res.json()

    // Save URL to content table
    await fetch('/api/content', {
      method: 'POST',
      body: JSON.stringify({ key: contentKey, value: url }),
      headers: { 'Content-Type': 'application/json' },
    })
    setCurrentUrl(url)
    setUploading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-semibold" style={{ color: '#28282B' }}>{label}</label>

      {currentUrl && (
        <img src={currentUrl} alt="Current photo"
          className="w-32 h-32 rounded-full object-cover border-2"
          style={{ borderColor: 'rgba(40,40,43,0.15)' }}/>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={() => fileRef.current?.click()}
          className="px-5 py-2 rounded-full text-sm"
          style={{ backgroundColor: '#28282B', color: '#F9F6EE' }}
        >
          {uploading ? 'Uploading…' : currentUrl ? 'Change Photo' : 'Upload Photo'}
        </button>
        {saved && <span className="text-green-600 text-sm">Photo saved!</span>}
        <input ref={fileRef} type="file" accept="image/*" className="hidden"
          onChange={e => e.target.files?.[0] && upload(e.target.files[0])}/>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   SHARED: ContentFields (for text key/value editing)
══════════════════════════════════════════════════════════ */
function ContentFields({ keys, labels }: { keys: string[], labels: Record<string, string> }) {
  const [values, setValues] = useState<Record<string, string>>({})
  const [saved, setSaved]   = useState<string | null>(null)

  useEffect(() => {
    Promise.all(
      keys.map(k => fetch(`/api/content?key=${k}`).then(r => r.json()).then(d => [k, d.value]))
    ).then(pairs => setValues(Object.fromEntries(pairs)))
  }, [])

  const save = async (key: string) => {
    await fetch('/api/content', {
      method: 'POST',
      body: JSON.stringify({ key, value: values[key] }),
      headers: { 'Content-Type': 'application/json' },
    })
    setSaved(key)
    setTimeout(() => setSaved(null), 2000)
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      {keys.map(k => (
        <div key={k} className="flex flex-col gap-2">
          <label className="text-sm font-semibold" style={{ color: '#28282B' }}>{labels[k]}</label>
          <textarea
            rows={k.includes('full') || k.includes('bio') ? 6 : 3}
            value={values[k] ?? ''}
            onChange={e => setValues(v => ({ ...v, [k]: e.target.value }))}
            className="rounded-lg px-4 py-2 outline-none resize-none text-sm w-full"
            style={inputStyle}
          />
          <div className="flex items-center gap-3">
            <button onClick={() => save(k)} className="px-5 py-1.5 rounded-full text-sm" style={btn()}>Save</button>
            {saved === k && <span className="text-green-600 text-sm">Saved!</span>}
          </div>
        </div>
      ))}
    </div>
  )
}
