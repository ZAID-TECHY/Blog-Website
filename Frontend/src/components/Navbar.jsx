
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { isAuthenticated, canWrite, user, logout } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <header className="border-b border-ink/8 bg-white/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">

        {/* Brand */}
        <Link
          to="/"
          className="font-display text-xl text-ink tracking-tight hover:text-accent transition-colors flex items-center gap-2"
        >
          <div className="w-7 h-7 rounded-lg bg-ink flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          Inkwell
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-3">
          <Link
            to="/"
            className={`text-sm transition-colors px-3 py-1.5 rounded-lg ${
              isActive('/') ? 'text-ink font-medium bg-paper-dark' : 'text-muted hover:text-ink hover:bg-paper/80'
            }`}
          >
            Home
          </Link>

          {isAuthenticated && (
            <Link
              to="/my-blogs"
              className={`text-sm transition-colors px-3 py-1.5 rounded-lg ${
                isActive('/my-blogs') ? 'text-ink font-medium bg-paper-dark' : 'text-muted hover:text-ink hover:bg-paper/80'
              }`}
            >
              My Posts
            </Link>
          )}

          {isAuthenticated && canWrite && (
            <Link to="/create" className="btn-primary text-sm py-2 px-4">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Post
            </Link>
          )}

          {isAuthenticated ? (
            <div className="flex items-center gap-3 ml-1 pl-3 border-l border-ink/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-ink text-white flex items-center justify-center text-xs font-medium">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <span className="text-sm text-muted hidden md:block">
                  {user?.name}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-muted hover:text-accent transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-1 pl-3 border-l border-ink/10">
              <Link to="/login" className="text-sm text-muted hover:text-ink transition-colors px-3 py-1.5 rounded-lg hover:bg-paper/80">
                Sign in
              </Link>
              <Link to="/register" className="btn-primary text-sm py-2 px-4">
                Register
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden text-muted hover:text-ink transition-colors p-1"
          onClick={() => setMenuOpen(p => !p)}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-ink/8 bg-white px-4 py-3 space-y-1 animate-fade-in">
          <Link to="/" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm text-ink hover:bg-paper-dark rounded-lg transition-colors">Home</Link>
          {isAuthenticated && (
            <Link to="/my-blogs" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm text-ink hover:bg-paper-dark rounded-lg transition-colors">My Posts</Link>
          )}
          {isAuthenticated && canWrite && (
            <Link to="/create" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-accent hover:bg-red-50 rounded-lg transition-colors">+ New Post</Link>
          )}
          {isAuthenticated ? (
            <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-sm text-muted hover:bg-paper-dark rounded-lg transition-colors">
              Sign out
            </button>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm text-ink hover:bg-paper-dark rounded-lg transition-colors">Sign in</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-accent hover:bg-red-50 rounded-lg transition-colors">Register</Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}

// import { Link, useNavigate } from 'react-router-dom'
// import { useAuth } from '../context/AuthContext'

// export default function Navbar() {
//   const { isAuthenticated, canWrite, user, logout } = useAuth()
//   const navigate = useNavigate()

//   const handleLogout = async () => {
//     await logout()
//     navigate('/login')
//   }

//   return (
//     <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-50 transition-all duration-200 shadow-sm shadow-slate-100/40">
//       <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
//         {/* Brand */}
//         <Link
//           to="/"
//           className="font-bold text-2xl bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent tracking-tight hover:opacity-90 transition-opacity"
//         >
//           Inkwell
//         </Link>

//         {/* Nav links */}
//         <nav className="flex items-center gap-5">
//           {isAuthenticated && canWrite && (
//             <Link
//               to="/create"
//               className="btn-primary text-sm py-1.5 px-4 shadow-sm"
//             >
//               + New Post
//             </Link>
//           )}

//           {isAuthenticated && (
//             <Link
//               to="/my-blogs"
//               className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
//             >
//               My Posts
//             </Link>
//           )}

//           {isAuthenticated ? (
//             <div className="flex items-center gap-4">
//               <span className="text-sm font-medium text-slate-700 hidden sm:inline-flex items-center gap-2 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
//                 {user?.name}
//                 <span className="bg-indigo-50 text-indigo-700 font-semibold text-[11px] tracking-wide px-2 py-0.5 rounded-md uppercase">
//                   {user?.role}
//                 </span>
//               </span>
//               <button
//                 onClick={handleLogout}
//                 className="text-sm font-medium text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
//               >
//                 Sign out
//               </button>
//             </div>
//           ) : (
//             <div className="flex items-center gap-4">
//               <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
//                 Sign in
//               </Link>
//               <Link to="/register" className="btn-primary text-sm py-1.5 px-4">
//                 Register
//               </Link>
//             </div>
//           )}
//         </nav>
//       </div>
//     </header>
//   )
// }
