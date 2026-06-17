
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function FieldError({ msg }) {
  if (!msg) return null
  return (
    <p className="text-xs text-accent mt-1 animate-fade-in flex items-center gap-1">
      <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm-.75 4a.75.75 0 0 1 1.5 0v3a.75.75 0 0 1-1.5 0V5Zm.75 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"/>
      </svg>
      {msg}
    </p>
  )
}

export default function LoginPage() {
  const { login }    = useAuth()
  const navigate     = useNavigate()
  const location     = useLocation()
  const from         = location.state?.from?.pathname || '/'

  const [form, setForm]         = useState({ email: '', password: '' })
  const [errors, setErrors]     = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading]   = useState(false)
  const [showPw, setShowPw]     = useState(false)

  const validate = () => {
    const e = {}
    if (!form.email.trim())              e.email    = 'Email is required.'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email.'
    if (!form.password.trim())           e.password = 'Password is required.'
    return e
  }

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
    setErrors(p => ({ ...p, [e.target.name]: '' }))
    setApiError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const v = validate()
    if (Object.keys(v).length) { setErrors(v); return }
    setLoading(true)
    try {
      await login({ email: form.email, password: form.password })
      navigate(from, { replace: true })
    } catch (err) {
      setApiError(err.response?.data?.message || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-56px)] bg-paper flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Brand mark */}
        <div className="text-center mb-10 animate-fade-up">
          <div className="w-14 h-14 rounded-2xl bg-ink flex items-center justify-center mx-auto mb-5 shadow-lg">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          <h1 className="font-display text-3xl text-ink mb-1.5">Welcome back</h1>
          <p className="text-muted text-sm">Sign in to your Inkwell account</p>
        </div>

        <div className="card animate-fade-up-1">

          {/* API error */}
          {apiError && (
            <div className="mx-6 mt-6 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-accent flex items-center gap-2 animate-fade-in">
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm-.75 4a.75.75 0 0 1 1.5 0v3a.75.75 0 0 1-1.5 0V5Zm.75 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"/>
              </svg>
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="px-6 py-6 flex flex-col gap-5">

            {/* Email */}
            <div>
              <label htmlFor="email" className="label">Email address</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30 pointer-events-none">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  id="email" name="email" type="email"
                  value={form.email} onChange={handleChange}
                  placeholder="you@example.com"
                  className={`input-field pl-10 ${errors.email ? 'border-accent ring-2 ring-accent/20 animate-shake' : ''}`}
                />
              </div>
              <FieldError msg={errors.email} />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="label">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30 pointer-events-none">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  id="password" name="password"
                  type={showPw ? 'text' : 'password'}
                  value={form.password} onChange={handleChange}
                  placeholder="••••••••"
                  className={`input-field pl-10 pr-10 ${errors.password ? 'border-accent ring-2 ring-accent/20 animate-shake' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/30 hover:text-ink/60 transition-colors"
                >
                  {showPw ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <FieldError msg={errors.password} />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 mt-1">
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : 'Sign in'}
            </button>
          </form>

          <div className="px-6 pb-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-ink/8" />
              <span className="text-xs text-muted">or</span>
              <div className="flex-1 h-px bg-ink/8" />
            </div>
            <p className="text-center text-sm text-muted">
              Don't have an account?{' '}
              <Link to="/register" className="text-accent hover:text-accent-hover font-medium transition-colors">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// import { useState } from 'react'
// import { Link, useNavigate, useLocation } from 'react-router-dom'
// import { useAuth } from '../context/AuthContext'
// import FormInput from '../components/FormInput'
// import Alert from '../components/Alert'

// export default function LoginPage() {
//   const { login } = useAuth()
//   const navigate = useNavigate()
//   const location = useLocation()
//   const from = location.state?.from?.pathname || '/'

//   const [form, setForm]       = useState({ email: '', password: '' })
//   const [errors, setErrors]   = useState({})
//   const [apiError, setApiError] = useState('')
//   const [loading, setLoading] = useState(false)

//   const validate = () => {
//     const e = {}
//     if (!form.email.trim())     e.email    = 'Email is required.'
//     else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email.'
//     if (!form.password.trim())  e.password = 'Password is required.'
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
//       await login({ email: form.email, password: form.password })
//       navigate(from, { replace: true })
//     } catch (err) {
//       setApiError(
//         err.response?.data?.message || 'Invalid credentials. Please try again.'
//       )
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-[calc(100vh-56px)] bg-paper flex items-center justify-center px-4">
//       <div className="w-full max-w-md">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="page-title mb-2">Welcome back</h1>
//           <p className="text-muted text-sm">Sign in to your Inkwell account</p>
//         </div>

//         <div className="bg-white rounded-xl border border-ink/10 p-8 shadow-sm">
//           <Alert type="error" message={apiError} />

//           <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-5">
//             <FormInput
//               label="Email address"
//               id="email"
//               type="email"
//               value={form.email}
//               onChange={handleChange}
//               placeholder="you@example.com"
//               error={errors.email}
//               required
//             />
//             <FormInput
//               label="Password"
//               id="password"
//               type="password"
//               value={form.password}
//               onChange={handleChange}
//               placeholder="••••••••"
//               error={errors.password}
//               required
//             />

//             <button
//               type="submit"
//               disabled={loading}
//               className="btn-primary w-full mt-1 py-3"
//             >
//               {loading ? 'Signing in…' : 'Sign in'}
//             </button>
//           </form>

//           <div className="divider" />

//           <p className="text-center text-sm text-muted">
//             Don&apos;t have an account?{' '}
//             <Link to="/register" className="text-accent hover:text-accent-hover font-medium">
//               Register
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }