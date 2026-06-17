
import { Link } from 'react-router-dom'

export default function BlogCard({ blog }) {
  const date = new Date(blog.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
  const writerName = typeof blog.writer === 'object' ? blog.writer?.name : null
  const readTime   = Math.max(1, Math.ceil((blog.content?.split(/\s+/).length || 0) / 200))

  return (
    <article className="card p-6 flex flex-col gap-3 group">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs uppercase tracking-widest text-muted font-medium">{date}</span>
        <span className="text-xs text-muted/60">{readTime} min read</span>
      </div>

      <h2 className="font-display text-xl text-ink leading-snug group-hover:text-accent transition-colors">
        {blog.title}
      </h2>

      {blog.Subtitle && (
        <p className="text-muted text-sm leading-relaxed line-clamp-2">{blog.Subtitle}</p>
      )}

      {blog.content && (
        <p className="text-ink/60 text-sm leading-relaxed line-clamp-3">{blog.content}</p>
      )}

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-ink/6">
        {writerName && (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-ink text-white flex items-center justify-center text-[10px] font-medium">
              {writerName.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs text-muted">{writerName}</span>
          </div>
        )}
        <Link
          to={`/blog/${blog._id}`}
          className="text-sm font-medium text-accent hover:text-accent-hover transition-colors inline-flex items-center gap-1 group/link ml-auto"
        >
          Read more
          <svg className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  )
}

// import { Link } from 'react-router-dom'

// export default function BlogCard({ blog }) {
//   const date = new Date(blog.createdAt).toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric',
//   })

//   const writerName =
//     typeof blog.writer === 'object' ? blog.writer?.name : null

//   return (
//     <article className="card p-6 flex flex-col gap-3.5 animate-fade-in bg-white group">
//       <div className="flex items-center justify-between gap-2 border-b border-slate-50 pb-2">
//         <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
//           {date}
//         </span>
//         {writerName && (
//           <span className="text-xs font-medium text-indigo-600/80 bg-indigo-50/50 px-2 py-0.5 rounded-md">
//             by {writerName}
//           </span>
//         )}
//       </div>

//       <h2 className="font-bold text-xl text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors duration-200">
//         {blog.title}
//       </h2>

//       {blog.Subtitle && (
//         <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-2">
//           {blog.Subtitle}
//         </p>
//       )}

//       {blog.content && (
//         <p className="text-slate-600/90 text-sm leading-relaxed line-clamp-3">
//           {blog.content}
//         </p>
//       )}

//       <Link
//         to={`/blog/${blog._id}`}
//         className="mt-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors inline-flex items-center gap-1 self-start"
//       >
//         Read more <span className="group-hover:translate-x-0.5 transition-transform duration-200">→</span>
//       </Link>
//     </article>
//   )
// }
