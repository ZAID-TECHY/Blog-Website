
import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getBlogById, deleteBlog } from '../api'
import { useAuth } from '../context/AuthContext'

export default function BlogDetailPage() {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const { user, canWrite } = useAuth()

  const [blog, setBlog]         = useState(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [deleting, setDeleting] = useState(false)
  const [confirmDel, setConfirmDel] = useState(false)

  useEffect(() => {
    getBlogById(id)
      .then(({ data }) => setBlog(data.Blog))
      .catch(() => setError('Post not found or failed to load.'))
      .finally(() => setLoading(false))
  }, [id])

  const writerId = typeof blog?.writer === 'object' ? blog.writer?._id : blog?.writer
  const isOwner  = user?._id === writerId
  const canEdit  = canWrite && isOwner

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteBlog(id)
      navigate('/', { replace: true })
    } catch {
      setError('Failed to delete. Try again.')
      setDeleting(false)
      setConfirmDel(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-5">
        <div className="skeleton h-4 w-20" />
        <div className="skeleton h-10 w-4/5" />
        <div className="skeleton h-5 w-2/3" />
        <div className="skeleton h-px w-full mt-8" />
        <div className="space-y-3 mt-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`skeleton h-4 ${i % 3 === 2 ? 'w-3/4' : 'w-full'}`} />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-accent flex items-center gap-2 mb-6">
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm-.75 4a.75.75 0 0 1 1.5 0v3a.75.75 0 0 1-1.5 0V5Zm.75 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"/>
          </svg>
          {error}
        </div>
        <Link to="/" className="text-accent text-sm hover:text-accent-hover transition-colors inline-flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to all posts
        </Link>
      </div>
    )
  }

  const date = blog
    ? new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : ''
  const updatedDate = blog && blog.updatedAt !== blog.createdAt
    ? new Date(blog.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null
  const writerName = typeof blog?.writer === 'object' ? blog.writer?.name : null

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

      {/* Back */}
      <Link
        to="/"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted hover:text-ink transition-colors group animate-fade-up"
      >
        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        All posts
      </Link>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-3 mb-5 animate-fade-up-1">
        <span className="text-xs uppercase tracking-widest text-muted font-medium">{date}</span>
        {writerName && (
          <>
            <span className="w-1 h-1 rounded-full bg-ink/20" />
            <span className="text-xs text-muted">by {writerName}</span>
          </>
        )}
        {updatedDate && (
          <>
            <span className="w-1 h-1 rounded-full bg-ink/20" />
            <span className="text-xs text-muted">Updated {updatedDate}</span>
          </>
        )}
      </div>

      {/* Title */}
      <h1 className="font-display text-3xl md:text-4xl text-ink leading-tight mb-4 animate-fade-up-2">
        {blog.title}
      </h1>

      {blog.Subtitle && (
        <p className="text-lg text-muted font-light leading-relaxed mb-8 animate-fade-up-2">
          {blog.Subtitle}
        </p>
      )}

      <div className="border-t border-ink/8 mb-8 animate-fade-up-2" />

      {/* Body */}
      <article className="text-ink/80 leading-relaxed whitespace-pre-wrap text-base animate-fade-up-3">
        {blog.content}
      </article>

      {/* Owner actions */}
      {canEdit && (
        <div className="mt-12 pt-6 border-t border-ink/8 animate-fade-up-4">
          {!confirmDel ? (
            <div className="flex gap-3">
              <Link to={`/edit/${blog._id}`} className="btn-secondary text-sm py-2 px-4">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit post
              </Link>
              <button onClick={() => setConfirmDel(true)} className="btn-danger">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 animate-fade-in p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-accent flex-1">
                <strong>Delete this post?</strong> This cannot be undone.
              </p>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="btn-accent text-sm py-2 px-4 inline-flex items-center gap-1.5"
              >
                {deleting ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : null}
                {deleting ? 'Deleting…' : 'Yes, delete'}
              </button>
              <button onClick={() => setConfirmDel(false)} className="btn-ghost text-sm py-2 px-3">
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </main>
  )
}

// import { useEffect, useState } from 'react'
// import { useParams, useNavigate, Link } from 'react-router-dom'
// import { getBlogById, deleteBlog } from '../api'
// import { useAuth } from '../context/AuthContext'
// import Alert from '../components/Alert'

// export default function BlogDetailPage() {
//   const { id } = useParams()
//   const navigate = useNavigate()
//   const { user, canWrite } = useAuth()

//   const [blog, setBlog]       = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError]     = useState('')
//   const [deleting, setDeleting] = useState(false)

//   useEffect(() => {
//     getBlogById(id)
//       .then(({ data }) => setBlog(data.Blog))
//       .catch(() => setError('Post not found or failed to load.'))
//       .finally(() => setLoading(false))
//   }, [id])

//   // Owner check: match writer id (may be object or string)
//   const writerId =
//     typeof blog?.writer === 'object' ? blog.writer?._id : blog?.writer
//   const isOwner = user?._id === writerId
//   const canEdit = canWrite && isOwner

//   const handleDelete = async () => {
//     if (!window.confirm('Delete this post permanently?')) return
//     setDeleting(true)
//     try {
//       await deleteBlog(id)
//       navigate('/', { replace: true })
//     } catch {
//       setError('Failed to delete. Try again.')
//       setDeleting(false)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="max-w-3xl mx-auto px-4 py-10 animate-pulse space-y-4">
//         <div className="h-8 bg-paper-dark rounded w-2/3" />
//         <div className="h-4 bg-paper-dark rounded w-1/3" />
//         <div className="h-3 bg-paper-dark rounded w-full mt-6" />
//         <div className="h-3 bg-paper-dark rounded w-5/6" />
//         <div className="h-3 bg-paper-dark rounded w-4/6" />
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="max-w-3xl mx-auto px-4 py-10">
//         <Alert type="error" message={error} />
//         <Link to="/" className="mt-6 inline-block text-accent text-sm hover:underline">
//           ← Back to all posts
//         </Link>
//       </div>
//     )
//   }

//   const date = blog
//     ? new Date(blog.createdAt).toLocaleDateString('en-US', {
//         year: 'numeric', month: 'long', day: 'numeric',
//       })
//     : ''

//   return (
//     <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
//       {/* Back link */}
//       <Link
//         to="/"
//         className="text-sm text-muted hover:text-ink transition-colors mb-8 inline-block"
//       >
//         ← All posts
//       </Link>

//       {/* Meta */}
//       <div className="flex items-center gap-2 mb-4">
//         <span className="text-xs uppercase tracking-widest text-muted">{date}</span>
//       </div>

//       {/* Title */}
//       <h1 className="font-display text-3xl md:text-4xl text-ink leading-tight mb-3">
//         {blog.title}
//       </h1>

//       {blog.Subtitle && (
//         <p className="text-lg text-muted font-light mb-8 border-b border-ink/10 pb-8">
//           {blog.Subtitle}
//         </p>
//       )}

//       {/* Body */}
//       <article className="prose prose-neutral max-w-none text-ink/80 leading-relaxed whitespace-pre-wrap">
//         {blog.content}
//       </article>

//       {/* Owner actions */}
//       {canEdit && (
//         <div className="mt-10 pt-6 border-t border-ink/10 flex gap-3">
//           <Link
//             to={`/edit/${blog._id}`}
//             className="btn-secondary text-sm py-2"
//           >
//             Edit post
//           </Link>
//           <button
//             onClick={handleDelete}
//             disabled={deleting}
//             className="btn-danger"
//           >
//             {deleting ? 'Deleting…' : 'Delete post'}
//           </button>
//         </div>
//       )}
//     </main>
//   )
// }