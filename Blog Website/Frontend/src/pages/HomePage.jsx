
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllBlogs } from '../api'
import { useAuth } from '../context/AuthContext'
import BlogCard from '../components/BlogCard'

export default function HomePage() {
  const { isAuthenticated, canWrite } = useAuth()
  const [blogs, setBlogs]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [search, setSearch]   = useState('')

  useEffect(() => {
    getAllBlogs()
      .then(({ data }) => setBlogs(data.Blog || []))
      .catch(() => setError('Could not load posts. Please refresh.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = blogs.filter(b =>
    !search ||
    b.title?.toLowerCase().includes(search.toLowerCase()) ||
    b.Subtitle?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

      {/* Hero */}
      <div className="mb-10 animate-fade-up">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted mb-2 font-medium">
              Inkwell — Stories worth reading
            </p>
            <h1 className="font-display text-4xl md:text-5xl text-ink leading-none">
              Latest Posts
            </h1>
          </div>
          {isAuthenticated && canWrite && (
            <Link to="/create" className="btn-primary shrink-0 self-start sm:self-auto">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Post
            </Link>
          )}
        </div>

        {/* Search bar */}
        {!loading && blogs.length > 2 && (
          <div className="mt-6 relative max-w-sm animate-fade-up-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30 pointer-events-none">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search posts…"
              className="input-field pl-9 text-sm py-2.5"
            />
            {search && (
              <button onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/30 hover:text-ink transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-ink/8 mb-8" />

      {/* Error */}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-6 space-y-3">
              <div className="skeleton h-3 w-24" />
              <div className="skeleton h-6 w-4/5" />
              <div className="skeleton h-3 w-full" />
              <div className="skeleton h-3 w-5/6" />
              <div className="skeleton h-3 w-3/4" />
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-24 animate-fade-up">
          <div className="w-16 h-16 rounded-2xl bg-paper-dark flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="font-display text-xl text-ink mb-2">
            {search ? 'No posts match your search' : 'No posts yet'}
          </h3>
          <p className="text-muted text-sm mb-6">
            {search ? 'Try a different keyword.' : 'Be the first to publish something.'}
          </p>
          {canWrite && !search && (
            <Link to="/create" className="btn-primary inline-flex">
              Write the first post
            </Link>
          )}
          {search && (
            <button onClick={() => setSearch('')} className="btn-secondary">
              Clear search
            </button>
          )}
        </div>
      )}

      {/* Grid */}
      {!loading && filtered.length > 0 && (
        <>
          {search && (
            <p className="text-sm text-muted mb-5 animate-fade-in">
              {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{search}"
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {filtered.map((blog, i) => (
              <div
                key={blog._id}
                className="animate-fade-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <BlogCard blog={blog} />
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  )
}

// import { useEffect, useState } from 'react'
// import { Link } from 'react-router-dom'
// import { getAllBlogs } from '../api'
// import { useAuth } from '../context/AuthContext'
// import BlogCard from '../components/BlogCard'
// import Alert from '../components/Alert'

// export default function HomePage() {
//   const { isAuthenticated, canWrite } = useAuth()
//   const [blogs, setBlogs]   = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError]   = useState('')

//   useEffect(() => {
//     getAllBlogs()
//       .then(({ data }) => setBlogs(data.Blog || []))
//       .catch(() => setError('Could not load posts. Please refresh.'))
//       .finally(() => setLoading(false))
//   }, [])

//   return (
//     <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
//       {/* Hero strip */}
//       <div className="mb-10 pb-8 border-b border-ink/10 flex items-end justify-between gap-4">
//         <div>
//           <p className="text-xs uppercase tracking-widest text-muted mb-2">
//             Inkwell — Stories worth reading
//           </p>
//           <h1 className="page-title">Latest Posts</h1>
//         </div>

//         {isAuthenticated && canWrite && (
//           <Link to="/create" className="btn-primary shrink-0">
//             + New Post
//           </Link>
//         )}
//       </div>

//       {/* States */}
//       {loading && (
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//           {[...Array(4)].map((_, i) => (
//             <div key={i} className="card p-6 animate-pulse space-y-3">
//               <div className="h-3 bg-paper-dark rounded w-24" />
//               <div className="h-5 bg-paper-dark rounded w-3/4" />
//               <div className="h-3 bg-paper-dark rounded w-full" />
//               <div className="h-3 bg-paper-dark rounded w-5/6" />
//             </div>
//           ))}
//         </div>
//       )}

//       {error && <Alert type="error" message={error} />}

//       {!loading && !error && blogs.length === 0 && (
//         <div className="text-center py-20">
//           <p className="text-muted mb-4">No posts yet.</p>
//           {canWrite && (
//             <Link to="/create" className="btn-primary inline-block">
//               Write the first post
//             </Link>
//           )}
//         </div>
//       )}

//       {!loading && blogs.length > 0 && (
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//           {blogs.map((blog) => (
//             <BlogCard key={blog._id} blog={blog} />
//           ))}
//         </div>
//       )}
//     </main>
//   )
// }