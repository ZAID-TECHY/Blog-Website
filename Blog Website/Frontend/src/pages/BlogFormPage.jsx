
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createBlog, updateBlog, getBlogById } from '../api'
import { useAuth } from '../context/AuthContext'

/* ─── tiny helpers ─────────────────────────────────── */
const TITLE_MAX   = 120
const WORD_GOAL   = 300
const AUTOSAVE_MS = 900

function wordCount(str) {
  return str.trim() ? str.trim().split(/\s+/).filter(Boolean).length : 0
}

function CharCount({ current, max }) {
  const pct = current / max
  const cls =
    pct >= 1 ? 'text-accent' : pct >= 0.88 ? 'text-warning' : 'text-ink/30'
  return (
    <span className={`text-xs tabular-nums transition-colors ${cls}`}>
      {current}/{max}
    </span>
  )
}

function FieldError({ msg }) {
  if (!msg) return null
  return (
    <p className="text-xs text-accent mt-1 animate-fade-in flex items-center gap-1">
      <svg className="w-3 h-3 shrink-0" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm-.75 4a.75.75 0 0 1 1.5 0v3a.75.75 0 0 1-1.5 0V5Zm.75 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"/>
      </svg>
      {msg}
    </p>
  )
}

/* ─── main component ───────────────────────────────── */
export default function BlogFormPage() {
  const { id }    = useParams()
  const isEdit    = !!id
  const navigate  = useNavigate()
  const { user }  = useAuth()

  const [form, setForm]       = useState({ title: '', Subtitle: '', content: '' })
  const [errors, setErrors]   = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)
  const [published, setPublished] = useState(false)

  /* autosave state */
  const [saveState, setSaveState] = useState('idle') // idle | saving | saved
  const autosaveRef = useRef(null)

  /* progress */
  const titleFilled    = form.title.trim().length > 0
  const subtitleFilled = form.Subtitle.trim().length > 0
  const wc             = wordCount(form.content)
  const progress = Math.min(
    100,
    (titleFilled ? 40 : 0) +
    (subtitleFilled ? 20 : 0) +
    Math.floor((wc / WORD_GOAL) * 40)
  )

  /* fetch existing blog in edit mode */
  useEffect(() => {
    if (!isEdit) return
    getBlogById(id)
      .then(({ data }) => {
        const b = data.Blog
        setForm({ title: b.title, Subtitle: b.Subtitle ?? '', content: b.content })
      })
      .catch(() => setApiError('Could not load post data.'))
      .finally(() => setFetching(false))
  }, [id, isEdit])

  /* autosave trigger */
  const triggerAutosave = () => {
    setSaveState('saving')
    clearTimeout(autosaveRef.current)
    autosaveRef.current = setTimeout(() => {
      setSaveState('saved')
      setTimeout(() => setSaveState('idle'), 2500)
    }, AUTOSAVE_MS)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
    setErrors(p => ({ ...p, [name]: '' }))
    setApiError('')
    triggerAutosave()
  }

  const validate = () => {
    const e = {}
    if (!form.title.trim())   e.title   = 'Title is required.'
    if (!form.content.trim()) e.content = 'Content is required.'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const v = validate()
    if (Object.keys(v).length) { setErrors(v); return }
    setLoading(true)
    try {
      if (isEdit) {
        await updateBlog(id, { Subtitle: form.Subtitle, content: form.content })
        navigate(`/blog/${id}`)
      } else {
        const { data } = await createBlog({ ...form, writer: user._id })
        setPublished(true)
        setTimeout(() => navigate(`/blog/${data.add._id}`), 1600)
      }
    } catch (err) {
      setApiError(err.response?.data?.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  /* ── skeleton while loading edit data ── */
  if (fetching) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-5">
        <div className="skeleton h-8 w-40" />
        <div className="skeleton h-10 w-full" />
        <div className="skeleton h-10 w-full" />
        <div className="skeleton h-48 w-full" />
      </div>
    )
  }

  /* ── success overlay ── */
  if (published) {
    return (
      <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4">
        <div className="text-center space-y-4 animate-fade-up">
          <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-success flex items-center justify-center mx-auto animate-success">
            <svg className="w-9 h-9 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-display text-2xl text-ink">Post published!</h2>
          <p className="text-muted text-sm">Redirecting you to your post…</p>
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    )
  }

  const saveDotCls = saveState === 'saving' ? 'dot-saving' : saveState === 'saved' ? 'dot-saved' : 'dot-idle'
  const saveLabel  = saveState === 'saving' ? 'Saving…' : saveState === 'saved' ? 'Draft saved' : 'Not saved'

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10">

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted hover:text-ink transition-colors group"
      >
        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <div className="flex items-center gap-2 mb-3">
          <span className={`badge ${isEdit ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-red-50 text-accent border border-red-200'}`}>
            {isEdit ? (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            ) : (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            )}
            {isEdit ? 'Editing post' : 'New post'}
          </span>
        </div>
        <h1 className="page-title mb-2">
          {isEdit ? 'Edit your post' : 'Write something worth reading'}
        </h1>
        <p className="text-muted text-sm">
          {isEdit
            ? 'Update the subtitle or content. The title is locked after creation.'
            : 'Share your ideas with everyone on Inkwell.'}
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-6 animate-fade-up-1">
        <div className="flex items-center justify-between text-xs text-muted mb-2">
          <span>Post completeness</span>
          <span className="font-medium tabular-nums">{progress}%</span>
        </div>
        <div className="h-1.5 bg-paper-dark rounded-full overflow-hidden">
          <div
            className="h-full progress-bar-fill rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div className="card animate-fade-up-2">

        {/* Card header */}
        <div className="px-6 py-4 border-b border-ink/8 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
            <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-ink">Post details</p>
            <p className="text-xs text-muted">Fields marked <span className="text-accent">*</span> are required</p>
          </div>
        </div>

        {/* API error */}
        {apiError && (
          <div className="mx-6 mt-5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-accent flex items-center gap-2 animate-fade-in">
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm-.75 4a.75.75 0 0 1 1.5 0v3a.75.75 0 0 1-1.5 0V5Zm.75 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"/>
            </svg>
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="px-6 py-6 flex flex-col gap-5">

          {/* Title */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="title" className="label mb-0">
                Title <span className="text-accent">*</span>
              </label>
              <div className="flex items-center gap-2">
                <CharCount current={form.title.length} max={TITLE_MAX} />
                {isEdit && (
                  <span className="badge bg-blue-50 text-blue-600 border border-blue-200 text-xs">
                    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M11.5 1a2.5 2.5 0 0 1 2.45 2H14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h.05A2.5 2.5 0 0 1 4.5 1h7ZM4.5 2A1.5 1.5 0 0 0 3.05 3H12.95A1.5 1.5 0 0 0 11.5 2h-7Z"/>
                    </svg>
                    Locked
                  </span>
                )}
              </div>
            </div>
            <input
              id="title"
              name="title"
              type="text"
              maxLength={TITLE_MAX}
              value={form.title}
              onChange={handleChange}
              disabled={isEdit}
              placeholder="A title that earns the click…"
              className={`input-field ${errors.title ? 'border-accent ring-2 ring-accent/20 animate-shake' : ''} ${isEdit ? 'opacity-55 cursor-not-allowed bg-paper' : ''}`}
            />
            <FieldError msg={errors.title} />
          </div>

          {/* Subtitle */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="Subtitle" className="label mb-0">
                Subtitle
                <span className="ml-2 normal-case text-xs font-normal text-muted/70">optional</span>
              </label>
              <CharCount current={form.Subtitle.length} max={200} />
            </div>
            <input
              id="Subtitle"
              name="Subtitle"
              type="text"
              maxLength={200}
              value={form.Subtitle}
              onChange={handleChange}
              placeholder="A short, compelling summary…"
              className="input-field"
            />
          </div>

          {/* Content */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="content" className="label mb-0">
                Content <span className="text-accent">*</span>
              </label>
              <span className={`text-xs tabular-nums transition-colors ${wc >= WORD_GOAL ? 'text-success' : 'text-muted'}`}>
                {wc} / {WORD_GOAL} words
              </span>
            </div>
            <textarea
              id="content"
              name="content"
              rows={10}
              value={form.content}
              onChange={handleChange}
              placeholder="Write your post here. Aim for clarity, depth, and something the reader couldn't find anywhere else…"
              className={`input-field resize-y min-h-[160px] ${errors.content ? 'border-accent ring-2 ring-accent/20 animate-shake' : ''}`}
            />
            {/* word-count progress */}
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-1 bg-paper-dark rounded-full overflow-hidden">
                <div
                  className="h-full wc-bar-fill rounded-full"
                  style={{
                    width: `${Math.min(100, (wc / WORD_GOAL) * 100)}%`,
                    background: wc >= WORD_GOAL ? '#27ae60' : '#c0392b',
                  }}
                />
              </div>
              <span className="text-xs text-muted shrink-0">
                {wc >= WORD_GOAL ? '✓ Goal reached' : `${WORD_GOAL - wc} words to go`}
              </span>
            </div>
            <FieldError msg={errors.content} />
          </div>

        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-ink/8 flex items-center justify-between gap-3 bg-paper/40">

          {/* autosave */}
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full transition-colors ${saveDotCls}`} />
            <span className="text-xs text-muted">{saveLabel}</span>
          </div>

          <div className="flex items-center gap-2">
            <button type="button" onClick={() => navigate(-1)} className="btn-ghost text-sm py-2 px-3">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary text-sm py-2 px-4"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  {isEdit ? 'Saving…' : 'Publishing…'}
                </>
              ) : (
                <>
                  {isEdit ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                  {isEdit ? 'Save changes' : 'Publish post'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}


// import { useEffect, useState } from 'react'
// import { useNavigate, useParams } from 'react-router-dom'
// import { createBlog, updateBlog, getBlogById } from '../api'
// import { useAuth } from '../context/AuthContext'
// import FormInput from '../components/FormInput'
// import Alert from '../components/Alert'

// export default function BlogFormPage() {
//   const { id } = useParams()          // present only on edit route
//   const isEdit  = !!id
//   const navigate = useNavigate()
//   const { user } = useAuth()

//   const [form, setForm] = useState({ title: '', Subtitle: '', content: '' })
//   const [errors, setErrors]     = useState({})
//   const [apiError, setApiError] = useState('')
//   const [loading, setLoading]   = useState(false)
//   const [fetching, setFetching] = useState(isEdit)

//   // Pre-fill form in edit mode
//   useEffect(() => {
//     if (!isEdit) return
//     getBlogById(id)
//       .then(({ data }) => {
//         const b = data.Blog
//         setForm({ title: b.title, Subtitle: b.Subtitle, content: b.content })
//       })
//       .catch(() => setApiError('Could not load post data.'))
//       .finally(() => setFetching(false))
//   }, [id, isEdit])

//   const validate = () => {
//     const e = {}
//     if (!form.title.trim())   e.title   = 'Title is required.'
//     if (!form.content.trim()) e.content = 'Content is required.'
//     return e
//   }

//   const handleChange = (e) => {
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
//     setErrors((prev) => ({ ...prev, [e.target.name]: '' }))
//     setApiError('')
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     const v = validate()
//     if (Object.keys(v).length) { setErrors(v); return }

//     setLoading(true)
//     try {
//       if (isEdit) {
//         await updateBlog(id, { Subtitle: form.Subtitle, content: form.content })
//         navigate(`/blog/${id}`)
//       } else {
//         const { data } = await createBlog({ ...form, writer: user._id })
//         navigate(`/blog/${data.add._id}`)
//       }
//     } catch (err) {
//       setApiError(
//         err.response?.data?.message || 'Something went wrong. Please try again.'
//       )
//     } finally {
//       setLoading(false)
//     }
//   }

//   if (fetching) {
//     return (
//       <div className="max-w-2xl mx-auto px-4 py-12 animate-pulse space-y-5">
//         <div className="h-8 bg-slate-200 rounded-lg w-1/3" />
//         <div className="h-4 bg-slate-200 rounded-lg w-1/2" />
//         <div className="h-64 bg-slate-200 rounded-xl mt-8" />
//       </div>
//     )
//   }

//   return (
//     <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
//       {/* Page title */}
//       <div className="mb-8 border-b border-slate-200 pb-4">
//         <h1 className="page-title text-slate-900">
//           {isEdit ? 'Edit post' : 'New post'}
//         </h1>
//         <p className="text-slate-500 text-sm mt-1.5 font-medium">
//           {isEdit
//             ? 'Update the subtitle or content of your post.'
//             : 'Share something worth reading with the world.'}
//         </p>
//       </div>

//       <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 shadow-md shadow-slate-100/80">
//         <Alert type="error" message={apiError} />

//         <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-6">
//           {/* Title — only editable on create */}
//           <div className={isEdit ? 'opacity-60 pointer-events-none' : ''}>
//             <FormInput
//               label="Title"
//               id="title"
//               value={form.title}
//               onChange={handleChange}
//               placeholder="A title that earns the click"
//               error={errors.title}
//               required={!isEdit}
//             />
//             {isEdit && (
//               <p className="text-xs font-medium text-slate-400 mt-1.5 pl-1">
//                 Title cannot be changed after creation.
//               </p>
//             )}
//           </div>

//           {/* If editing, make title readonly */}
//           {isEdit && (
//             <input type="hidden" name="title" value={form.title} readOnly />
//           )}

//           <FormInput
//             label="Subtitle"
//             id="Subtitle"
//             value={form.Subtitle}
//             onChange={handleChange}
//             placeholder="A short, compelling summary (optional)"
//           />

//           <FormInput
//             label="Content"
//             id="content"
//             value={form.content}
//             onChange={handleChange}
//             placeholder="Write your post here…"
//             error={errors.content}
//             required
//             rows={12}
//           />

//           <div className="flex items-center gap-3 mt-2 pt-4 border-t border-slate-50">
//             <button
//               type="submit"
//               disabled={loading}
//               className="btn-primary min-w-[120px]"
//             >
//               {loading
//                 ? isEdit ? 'Saving…' : 'Publishing…'
//                 : isEdit ? 'Save changes' : 'Publish post'}
//             </button>
//             <button
//               type="button"
//               onClick={() => navigate(-1)}
//               className="btn-secondary"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </main>
//   )
// }
