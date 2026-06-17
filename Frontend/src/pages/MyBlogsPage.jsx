
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMyBlogs, deleteBlog } from '../api'
import { useAuth } from '../context/AuthContext'

export default function MyBlogsPage() {
  const { user, canWrite } = useAuth()
  const [blogs, setBlogs]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [delId, setDelId]     = useState(null)
  const [confirmId, setConfirmId] = useState(null)

  useEffect(() => {
    getMyBlogs()
      .then(({ data }) => setBlogs(data.data || []))
      .catch(() => setError('Failed to load your posts.'))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    setDelId(id)
    try {
      await deleteBlog(id)
      setBlogs(p => p.filter(b => b._id !== id))
    } catch {
      setError('Delete failed. Please try again.')
    } finally {
      setDelId(null)
      setConfirmId(null)
    }
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 animate-fade-up">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-ink text-white flex items-center justify-center text-xs font-medium">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <span className="text-sm text-muted">{user?.name}</span>
            <span className="badge bg-paper-dark text-ink/50 border border-ink/10 capitalize">{user?.role}</span>
          </div>
          <h1 className="page-title">My Posts</h1>
        </div>
        {canWrite && (
          <Link to="/create" className="btn-primary shrink-0 self-start sm:self-auto">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Post
          </Link>
        )}
      </div>

      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-accent flex items-center gap-2 mb-6 animate-fade-in">
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm-.75 4a.75.75 0 0 1 1.5 0v3a.75.75 0 0 1-1.5 0V5Zm.75 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"/>
          </svg>
          {error}
        </div>
      )}

      {/* Skeleton */}
      {loading && (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-5 flex items-center gap-4">
              <div className="flex-1 space-y-2">
                <div className="skeleton h-3 w-20" />
                <div className="skeleton h-5 w-2/3" />
                <div className="skeleton h-3 w-1/2" />
              </div>
              <div className="skeleton h-8 w-24 shrink-0" />
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && blogs.length === 0 && !error && (
        <div className="text-center py-24 animate-fade-up">
          <div className="w-16 h-16 rounded-2xl bg-paper-dark flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="font-display text-xl text-ink mb-2">No posts yet</h3>
          <p className="text-muted text-sm mb-6">You haven't published anything yet.</p>
          {canWrite && <Link to="/create" className="btn-primary inline-flex">Write your first post</Link>}
        </div>
      )}

      {/* List */}
      {!loading && blogs.length > 0 && (
        <div className="space-y-3">
          {/* Stats bar */}
          <div className="flex items-center gap-4 mb-6 animate-fade-up-1">
            <div className="text-center px-4 py-3 bg-white border border-ink/8 rounded-xl">
              <p className="text-2xl font-display text-ink">{blogs.length}</p>
              <p className="text-xs text-muted mt-0.5">Post{blogs.length !== 1 ? 's' : ''}</p>
            </div>
          </div>

          {blogs.map((blog, i) => {
            const date = new Date(blog.createdAt).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric',
            })
            const isConfirming = confirmId === blog._id
            const isDeleting   = delId === blog._id

            return (
              <div
                key={blog._id}
                className="card p-5 animate-fade-up"
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                {!isConfirming ? (
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted mb-1">{date}</p>
                      <h2 className="font-display text-lg text-ink truncate mb-0.5">{blog.title}</h2>
                      {blog.Subtitle && (
                        <p className="text-sm text-muted truncate">{blog.Subtitle}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Link
                        to={`/blog/${blog._id}`}
                        className="text-xs text-muted hover:text-ink transition-colors px-2.5 py-1.5 rounded-md hover:bg-paper-dark"
                      >
                        View
                      </Link>
                      {canWrite && (
                        <>
                          <Link
                            to={`/edit/${blog._id}`}
                            className="text-xs font-medium text-ink hover:text-accent transition-colors px-2.5 py-1.5 rounded-md hover:bg-paper-dark"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => setConfirmId(blog._id)}
                            className="text-xs font-medium text-accent/70 hover:text-accent transition-colors px-2.5 py-1.5 rounded-md hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 animate-fade-in">
                    <p className="text-sm text-ink/70 flex-1">
                      Delete <strong className="text-ink">"{blog.title}"</strong>?
                    </p>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      disabled={isDeleting}
                      className="btn-accent text-xs py-1.5 px-3 inline-flex items-center gap-1.5"
                    >
                      {isDeleting ? (
                        <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      ) : null}
                      {isDeleting ? 'Deleting…' : 'Delete'}
                    </button>
                    <button
                      onClick={() => setConfirmId(null)}
                      className="text-xs text-muted hover:text-ink px-2.5 py-1.5 rounded-md hover:bg-paper-dark transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}

// import { useEffect, useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { getMyBlogs, deleteBlog } from '../api'
// import { useAuth } from '../context/AuthContext'
// import Alert from '../components/Alert'

// export default function MyBlogsPage() {
//   const { user, canWrite } = useAuth()
//   const navigate = useNavigate()
//   const [blogs, setBlogs]     = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError]     = useState('')
//   const [delId, setDelId]     = useState(null)   // tracking which post is being deleted

//   const fetchBlogs = () => {
//     setLoading(true)
//     getMyBlogs()
//       .then(({ data }) => setBlogs(data.data || []))
//       .catch(() => setError('Failed to load your posts.'))
//       .finally(() => setLoading(false))
//   }

//   useEffect(fetchBlogs, [])

//   const handleDelete = async (id) => {
//     if (!window.confirm('Delete this post permanently?')) return
//     setDelId(id)
//     try {
//       await deleteBlog(id)
//       setBlogs((prev) => prev.filter((b) => b._id !== id))
//     } catch {
//       setError('Delete failed. Please try again.')
//     } finally {
//       setDelId(null)
//     }
//   }

//   return (
//     <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
//       <div className="flex items-end justify-between gap-4 mb-8 pb-6 border-b border-ink/10">
//         <div>
//           <p className="text-xs uppercase tracking-widest text-muted mb-1">
//             {user?.name}
//           </p>
//           <h1 className="page-title">My Posts</h1>
//         </div>
//         {canWrite && (
//           <Link to="/create" className="btn-primary shrink-0">
//             + New Post
//           </Link>
//         )}
//       </div>

//       {error && <Alert type="error" message={error} />}

//       {loading && (
//         <div className="space-y-4">
//           {[...Array(3)].map((_, i) => (
//             <div key={i} className="card p-5 animate-pulse flex gap-4 items-center">
//               <div className="flex-1 space-y-2">
//                 <div className="h-4 bg-paper-dark rounded w-1/2" />
//                 <div className="h-3 bg-paper-dark rounded w-3/4" />
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {!loading && blogs.length === 0 && !error && (
//         <div className="text-center py-20">
//           <p className="text-muted mb-4">You haven&apos;t published anything yet.</p>
//           {canWrite && (
//             <Link to="/create" className="btn-primary inline-block">
//               Write your first post
//             </Link>
//           )}
//         </div>
//       )}

//       {!loading && blogs.length > 0 && (
//         <div className="space-y-4">
//           {blogs.map((blog) => {
//             const date = new Date(blog.createdAt).toLocaleDateString('en-US', {
//               year: 'numeric', month: 'short', day: 'numeric',
//             })
//             return (
//               <div
//                 key={blog._id}
//                 className="card p-5 flex items-start justify-between gap-4"
//               >
//                 <div className="flex-1 min-w-0">
//                   <p className="text-xs text-muted mb-1">{date}</p>
//                   <h2 className="font-display text-lg text-ink truncate mb-0.5">
//                     {blog.title}
//                   </h2>
//                   {blog.Subtitle && (
//                     <p className="text-sm text-muted truncate">{blog.Subtitle}</p>
//                   )}
//                 </div>

//                 {/* Actions */}
//                 <div className="flex items-center gap-2 shrink-0">
//                   <Link
//                     to={`/blog/${blog._id}`}
//                     className="text-xs text-muted hover:text-ink transition-colors"
//                   >
//                     View
//                   </Link>
//                   {canWrite && (
//                     <>
//                       <Link
//                         to={`/edit/${blog._id}`}
//                         className="text-xs font-medium text-ink hover:text-accent transition-colors"
//                       >
//                         Edit
//                       </Link>
//                       <button
//                         onClick={() => handleDelete(blog._id)}
//                         disabled={delId === blog._id}
//                         className="text-xs font-medium text-accent hover:text-accent-hover transition-colors disabled:opacity-50"
//                       >
//                         {delId === blog._id ? 'Deleting…' : 'Delete'}
//                       </button>
//                     </>
//                   )}
//                 </div>
//               </div>
//             )
//           })}
//         </div>
//       )}
//     </main>
//   )
// }