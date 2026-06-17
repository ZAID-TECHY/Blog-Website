
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ROLES = [
  { value: 'reader', label: 'Reader', desc: 'Read and enjoy posts', icon: '📖' },
  { value: 'writer', label: 'Writer', desc: 'Create and publish posts', icon: '✍️' },
]

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

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate     = useNavigate()

  const [form, setForm]         = useState({ name: '', email: '', password: '', role: 'reader' })
  const [errors, setErrors]     = useState({})
  const [apiError, setApiError] = useState('')
  const [success, setSuccess]   = useState(false)
  const [loading, setLoading]   = useState(false)
  const [showPw, setShowPw]     = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim())                          e.name     = 'Name is required.'
    if (!form.email.trim())                         e.email    = 'Email is required.'
    else if (!/\S+@\S+\.\S+/.test(form.email))     e.email    = 'Enter a valid email.'
    if (!form.password.trim())                      e.password = 'Password is required.'
    else if (form.password.length < 6)              e.password = 'Minimum 6 characters.'
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
      await register(form)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 1800)
    } catch (err) {
      setApiError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4">
        <div className="text-center space-y-4 animate-fade-up">
          <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-success flex items-center justify-center mx-auto animate-success">
            <svg className="w-9 h-9 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-display text-2xl text-ink">Account created!</h2>
          <p className="text-muted text-sm">Redirecting you to sign in…</p>
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-56px)] bg-paper flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        <div className="text-center mb-10 animate-fade-up">
          <div className="w-14 h-14 rounded-2xl bg-ink flex items-center justify-center mx-auto mb-5 shadow-lg">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="font-display text-3xl text-ink mb-1.5">Create an account</h1>
          <p className="text-muted text-sm">Join Inkwell and start reading or writing</p>
        </div>

        <div className="card animate-fade-up-1">
          {apiError && (
            <div className="mx-6 mt-6 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-accent flex items-center gap-2 animate-fade-in">
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm-.75 4a.75.75 0 0 1 1.5 0v3a.75.75 0 0 1-1.5 0V5Zm.75 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"/>
              </svg>
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="px-6 py-6 flex flex-col gap-5">

            {/* Name */}
            <div>
              <label htmlFor="name" className="label">Full name</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30 pointer-events-none">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <input id="name" name="name" type="text" value={form.name} onChange={handleChange}
                  placeholder="Ali Khan"
                  className={`input-field pl-10 ${errors.name ? 'border-accent ring-2 ring-accent/20 animate-shake' : ''}`}
                />
              </div>
              <FieldError msg={errors.name} />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="label">Email address</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30 pointer-events-none">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input id="email" name="email" type="email" value={form.email} onChange={handleChange}
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
                <input id="password" name="password" type={showPw ? 'text' : 'password'}
                  value={form.password} onChange={handleChange} placeholder="Min. 6 characters"
                  className={`input-field pl-10 pr-10 ${errors.password ? 'border-accent ring-2 ring-accent/20 animate-shake' : ''}`}
                />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/30 hover:text-ink/60 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showPw
                      ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      : <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
                    }
                  </svg>
                </button>
              </div>
              {/* strength bar */}
              {form.password.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className={`flex-1 h-1 rounded-full transition-colors duration-300 ${
                      form.password.length > i * 2
                        ? form.password.length < 6 ? 'bg-accent' : form.password.length < 10 ? 'bg-warning' : 'bg-success'
                        : 'bg-paper-dark'
                    }`} />
                  ))}
                  <span className="text-xs text-muted shrink-0">
                    {form.password.length < 6 ? 'Weak' : form.password.length < 10 ? 'Fair' : 'Strong'}
                  </span>
                </div>
              )}
              <FieldError msg={errors.password} />
            </div>

            {/* Role */}
            <div>
              <label className="label">Account type</label>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map(r => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setForm(p => ({ ...p, role: r.value }))}
                    className={`p-3 rounded-lg border text-left transition-all duration-200 ${
                      form.role === r.value
                        ? 'border-accent bg-red-50 shadow-sm'
                        : 'border-ink/10 hover:border-ink/25'
                    }`}
                  >
                    <div className="text-base mb-1">{r.icon}</div>
                    <div className={`text-sm font-medium ${form.role === r.value ? 'text-accent' : 'text-ink'}`}>{r.label}</div>
                    <div className="text-xs text-muted mt-0.5">{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 mt-1">
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Creating account…
                </>
              ) : 'Create account'}
            </button>
          </form>

          <div className="px-6 pb-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-ink/8" />
              <span className="text-xs text-muted">or</span>
              <div className="flex-1 h-px bg-ink/8" />
            </div>
            <p className="text-center text-sm text-muted">
              Already have an account?{' '}
              <Link to="/login" className="text-accent hover:text-accent-hover font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// import { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { useAuth } from '../context/AuthContext'
// import FormInput from '../components/FormInput'
// import Alert from '../components/Alert'

// const ROLES = ['reader', 'writer']

// export default function RegisterPage() {
//   const { register } = useAuth()
//   const navigate = useNavigate()

//   const [form, setForm] = useState({
//     name: '', email: '', password: '', role: 'reader',
//   })
//   const [errors, setErrors]     = useState({})
//   const [apiError, setApiError] = useState('')
//   const [success, setSuccess]   = useState('')
//   const [loading, setLoading]   = useState(false)

//   const validate = () => {
//     const e = {}
//     if (!form.name.trim())      e.name     = 'Name is required.'
//     if (!form.email.trim())     e.email    = 'Email is required.'
//     else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email.'
//     if (!form.password.trim())  e.password = 'Password is required.'
//     else if (form.password.length < 6)         e.password = 'Minimum 6 characters.'
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
//       await register(form)
//       setSuccess('Account created! Redirecting to login…')
//       setTimeout(() => navigate('/login'), 1500)
//     } catch (err) {
//       setApiError(
//         err.response?.data?.message || 'Registration failed. Please try again.'
//       )
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-[calc(100vh-56px)] bg-paper flex items-center justify-center px-4">
//       <div className="w-full max-w-md">
//         <div className="text-center mb-8">
//           <h1 className="page-title mb-2">Create an account</h1>
//           <p className="text-muted text-sm">Join Inkwell and start reading or writing</p>
//         </div>

//         <div className="bg-white rounded-xl border border-ink/10 p-8 shadow-sm">
//           <Alert type="error"   message={apiError} />
//           <Alert type="success" message={success}  />

//           <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-5">
//             <FormInput
//               label="Full name"
//               id="name"
//               value={form.name}
//               onChange={handleChange}
//               placeholder="Ali Khan"
//               error={errors.name}
//               required
//             />
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
//               placeholder="Min. 6 characters"
//               error={errors.password}
//               required
//             />

//             {/* Role selector */}
//             <div className="flex flex-col gap-1">
//               <label htmlFor="role" className="label">
//                 Account type <span className="text-accent">*</span>
//               </label>
//               <select
//                 id="role"
//                 name="role"
//                 value={form.role}
//                 onChange={handleChange}
//                 className="input-field"
//               >
//                 {ROLES.map((r) => (
//                   <option key={r} value={r} className="capitalize">
//                     {r.charAt(0).toUpperCase() + r.slice(1)}
//                   </option>
//                 ))}
//               </select>
//               <p className="text-xs text-muted">
//                 Writers can create and manage blog posts.
//               </p>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="btn-primary w-full mt-1 py-3"
//             >
//               {loading ? 'Creating account…' : 'Create account'}
//             </button>
//           </form>

//           <div className="divider" />

//           <p className="text-center text-sm text-muted">
//             Already have an account?{' '}
//             <Link to="/login" className="text-accent hover:text-accent-hover font-medium">
//               Sign in
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }