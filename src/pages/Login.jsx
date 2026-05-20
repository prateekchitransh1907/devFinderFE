import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import { clearAuthError } from '../reducers/auth/authSlice'
import { loginUser, signupUser } from '../actions/login'

const SKILL_OPTIONS = ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'Go', 'Rust', 'CSS', 'SQL']
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// ─── Signup Form ─────────────────────────────────────────────────────────────
function SignupForm({ onSuccess, onSwitchToLogin }) {
    const dispatch = useDispatch()
    const signupStatus = useSelector((state) => state.auth.signup.status)
    const signupError = useSelector((state) => state.auth.signup.error)
    const isBusy = signupStatus === 'pending'

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        emailId: '',
        password: '',
        gender: '',
        about: '',
        age: '',
    })
    const [skills, setSkills] = useState([])
    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState({})
    const [serverError, setServerError] = useState('')

    useEffect(() => {
        if (signupError) setServerError(signupError)
    }, [signupError])

    useEffect(() => {
        if (!serverError) return undefined
        const t = setTimeout(() => {
            setServerError('')
            dispatch(clearAuthError())
        }, 4000)
        return () => clearTimeout(t)
    }, [dispatch, serverError])

    function set(field, value) {
        setForm(prev => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
    }

    function toggleSkill(skill) {
        setSkills(prev =>
            prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
        )
    }

    function validate() {
        const e = {}
        if (!form.firstName.trim()) e.firstName = 'First name is required'
        if (!form.lastName.trim()) e.lastName = 'Last name is required'
        if (!form.emailId.trim()) e.emailId = 'Email is required'
        else if (!emailPattern.test(form.emailId.trim())) e.emailId = 'Enter a valid email'
        if (!form.password) e.password = 'Password is required'
        else if (form.password.length < 6) e.password = 'Minimum 6 characters'
        if (!form.gender) e.gender = 'Gender is required'
        if (form.age && (isNaN(Number(form.age)) || Number(form.age) < 1)) e.age = 'Enter a valid age'
        setErrors(e)
        return Object.keys(e).length === 0
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setServerError('')
        dispatch(clearAuthError())
        if (!validate()) return

        const result = await dispatch(signupUser({ ...form, skills }))
        if (result.success) {
            onSuccess()
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {serverError && (
                <div role="alert" className="alert alert-error py-2 text-sm">
                    <span>⚠️ {serverError}</span>
                </div>
            )}

            {/* Name row */}
            <div className="flex gap-2">
                <label className="form-control flex-1">
                    <div className="label pb-0.5"><span className="label-text text-xs">First Name *</span></div>
                    <input
                        type="text"
                        placeholder="Elon"
                        className={`input input-bordered input-sm w-full ${errors.firstName ? 'input-error' : ''}`}
                        value={form.firstName}
                        onChange={e => set('firstName', e.target.value)}
                        disabled={isBusy}
                    />
                    {errors.firstName && <span className="label-text-alt text-error text-xs mt-0.5">{errors.firstName}</span>}
                </label>
                <label className="form-control flex-1">
                    <div className="label pb-0.5"><span className="label-text text-xs">Last Name *</span></div>
                    <input
                        type="text"
                        placeholder="Musk"
                        className={`input input-bordered input-sm w-full ${errors.lastName ? 'input-error' : ''}`}
                        value={form.lastName}
                        onChange={e => set('lastName', e.target.value)}
                        disabled={isBusy}
                    />
                    {errors.lastName && <span className="label-text-alt text-error text-xs mt-0.5">{errors.lastName}</span>}
                </label>
            </div>

            {/* Email */}
            <label className="form-control w-full">
                <div className="label pb-0.5"><span className="label-text text-xs">Email *</span></div>
                <input
                    type="email"
                    placeholder="elon@example.com"
                    className={`input input-bordered input-sm w-full ${errors.emailId ? 'input-error' : ''}`}
                    value={form.emailId}
                    onChange={e => set('emailId', e.target.value)}
                    autoComplete="email"
                    disabled={isBusy}
                />
                {errors.emailId && <span className="label-text-alt text-error text-xs mt-0.5">{errors.emailId}</span>}
            </label>

            {/* Password */}
            <label className="form-control w-full">
                <div className="label pb-0.5"><span className="label-text text-xs">Password *</span></div>
                <div className="join w-full">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className={`input input-bordered input-sm join-item w-full ${errors.password ? 'input-error' : ''}`}
                        value={form.password}
                        onChange={e => set('password', e.target.value)}
                        autoComplete="new-password"
                        disabled={isBusy}
                    />
                    <button
                        type="button"
                        className="btn btn-outline btn-sm join-item"
                        onClick={() => setShowPassword(p => !p)}
                        disabled={isBusy}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                        {showPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414L3.707 2.293zM10 4c.34 0 .674.024 1 .07V4a7 7 0 017 7 6.97 6.97 0 01-.7 3.02l-1.47-1.47A5 5 0 0010 6a4.98 4.98 0 00-2.48.66L6.05 5.19A7.02 7.02 0 0110 4zM3.07 10.93A6.97 6.97 0 013 11a7 7 0 007 7 6.97 6.97 0 003.02-.7l-1.47-1.47A5 5 0 015 11c0-.69.14-1.35.38-1.95L3.07 10.93z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                        )}
                    </button>
                </div>
                {errors.password && <span className="label-text-alt text-error text-xs mt-0.5">{errors.password}</span>}
            </label>

            {/* Gender + Age row */}
            <div className="flex gap-2">
                <label className="form-control flex-1">
                    <div className="label pb-0.5"><span className="label-text text-xs">Gender *</span></div>
                    <select
                        className={`select select-bordered select-sm w-full ${errors.gender ? 'select-error' : ''}`}
                        value={form.gender}
                        onChange={e => set('gender', e.target.value)}
                        disabled={isBusy}
                    >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    {errors.gender && <span className="label-text-alt text-error text-xs mt-0.5">{errors.gender}</span>}
                </label>
                <label className="form-control w-24">
                    <div className="label pb-0.5"><span className="label-text text-xs">Age</span></div>
                    <input
                        type="number"
                        placeholder="25"
                        className={`input input-bordered input-sm w-full ${errors.age ? 'input-error' : ''}`}
                        value={form.age}
                        onChange={e => set('age', e.target.value)}
                        min={1}
                        max={120}
                        disabled={isBusy}
                    />
                    {errors.age && <span className="label-text-alt text-error text-xs mt-0.5">{errors.age}</span>}
                </label>
            </div>

            {/* About */}
            <label className="form-control w-full">
                <div className="label pb-0.5"><span className="label-text text-xs">About</span></div>
                <textarea
                    placeholder="Tell developers about yourself..."
                    className="textarea textarea-bordered textarea-sm w-full resize-none"
                    rows={2}
                    value={form.about}
                    onChange={e => set('about', e.target.value)}
                    disabled={isBusy}
                />
            </label>

            {/* Skills */}
            <div>
                <p className="label-text text-xs mb-1.5">Skills</p>
                <div className="flex flex-wrap gap-1.5">
                    {SKILL_OPTIONS.map(skill => (
                        <button
                            key={skill}
                            type="button"
                            onClick={() => toggleSkill(skill)}
                            disabled={isBusy}
                            className={`badge badge-md cursor-pointer select-none transition-colors ${skills.includes(skill)
                                    ? 'badge-primary'
                                    : 'badge-outline hover:badge-primary'
                                }`}
                        >
                            {skill}
                        </button>
                    ))}
                </div>
            </div>

            <button type="submit" className="btn btn-primary w-full mt-1" disabled={isBusy}>
                {isBusy ? (
                    <span className="inline-flex items-center gap-2">
                        <span className="loading loading-spinner loading-sm" />
                        Creating account...
                    </span>
                ) : (
                    'Create Account'
                )}
            </button>

            <p className="text-center text-sm text-base-content/60">
                Already have an account?{' '}
                <button type="button" className="link link-primary font-medium" onClick={onSwitchToLogin}>
                    Sign In
                </button>
            </p>
        </form>
    )
}

// ─── Login Page ───────────────────────────────────────────────────────────────
function Login() {
    const [mode, setMode] = useState('login') // 'login' | 'signup'
    const [tab, setTab] = useState('email') // 'email' | 'phone'
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [phone, setPhone] = useState('')
    const [otp, setOtp] = useState('')
    const [otpSent, setOtpSent] = useState(false)
    const [error, setError] = useState('')
    const [isRedirecting, setIsRedirecting] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const loginStatus = useSelector((state) => state.auth.login.status)
    const loginError = useSelector((state) => state.auth.login.error)

    const phonePattern = /^\d{10}$/
    const isPhoneValid = phonePattern.test(phone.trim())
    const isBusy = loginStatus === 'pending' || isRedirecting

    useEffect(() => {
        if (!loginError) return
        setError(loginError)
    }, [loginError])

    useEffect(() => {
        if (!error) return undefined
        const timer = setTimeout(() => {
            setError('')
            dispatch(clearAuthError())
        }, 4000)
        return () => clearTimeout(timer)
    }, [dispatch, error])

    function validateEmailLogin() {
        let valid = true
        const trimmedEmail = email.trim()
        if (!trimmedEmail) {
            setEmailError('Email is required')
            valid = false
        } else if (!emailPattern.test(trimmedEmail)) {
            setEmailError('Please enter a valid email address')
            valid = false
        } else {
            setEmailError('')
        }
        if (!password.trim()) {
            setPasswordError('Password is required')
            valid = false
        } else {
            setPasswordError('')
        }
        return valid
    }

    async function handleEmailLogin(e) {
        e.preventDefault()
        setError('')
        dispatch(clearAuthError())
        if (!validateEmailLogin()) return

        const result = await dispatch(loginUser({ emailId: email.trim(), password }))
        if (result.success) {
            setIsRedirecting(true)
            await new Promise((resolve) => setTimeout(resolve, 700))
            navigate('/')
            setIsRedirecting(false)
        }
    }

    function handleSendOtp(e) {
        e.preventDefault()
        setError('')
        dispatch(clearAuthError())
        if (!isPhoneValid) {
            setError('Please enter a valid 10-digit mobile number')
            return
        }
        setOtpSent(true)
    }

    async function handleSignupSuccess() {
        setIsRedirecting(true)
        await new Promise((resolve) => setTimeout(resolve, 700))
        navigate('/')
        setIsRedirecting(false)
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 px-4 py-8 gap-6">
            {error && (
                <div className="toast toast-top toast-end z-50">
                    <div role="alert" className="alert alert-error shadow-lg">
                        <span>⚠️ {error}</span>
                        <button
                            type="button"
                            className="btn btn-ghost btn-xs"
                            onClick={() => {
                                setError('')
                                dispatch(clearAuthError())
                            }}
                            aria-label="Dismiss error"
                        >
                            ✖
                        </button>
                    </div>
                </div>
            )}

            {isRedirecting && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-base-100/75 backdrop-blur-sm">
                    <div className="flex items-center gap-3 rounded-xl bg-base-100 px-5 py-4 shadow-xl">
                        <span className="loading loading-spinner loading-md text-primary" />
                        <span className="text-sm font-medium">
                            {mode === 'signup' ? 'Creating account...' : 'Logging in...'}
                        </span>
                    </div>
                </div>
            )}

            <Logo size="lg" />

            {/* ── Signup card ── */}
            {mode === 'signup' && (
                <div className="card w-full max-w-sm bg-base-100 shadow-xl">
                    <div className="card-body gap-4">
                        <h2 className="card-title text-2xl font-bold justify-center">Create Account</h2>
                        <p className="text-center text-base-content/60 text-sm -mt-2">Join the developer community</p>
                        <SignupForm
                            onSuccess={handleSignupSuccess}
                            onSwitchToLogin={() => {
                                setMode('login')
                                dispatch(clearAuthError())
                            }}
                        />
                    </div>
                </div>
            )}

            {/* ── Login card ── */}
            {mode === 'login' && (
                <div className="card w-full max-w-sm bg-base-100 shadow-xl">
                    <div className="card-body gap-4">
                        <h2 className="card-title text-2xl font-bold justify-center">Sign In</h2>
                        <p className="text-center text-base-content/60 text-sm">Choose a method to continue</p>

                        {/* Segmented Switch */}
                        <div className="relative flex w-full rounded-full bg-base-200 p-1">
                            <span
                                className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-primary shadow-md transition-transform duration-300 ease-in-out"
                                style={{ transform: tab === 'phone' ? 'translateX(calc(100% + 8px))' : 'translateX(0)' }}
                                aria-hidden="true"
                            />
                            <button
                                type="button"
                                onClick={() => { setTab('email'); setError(''); dispatch(clearAuthError()) }}
                                disabled={isBusy}
                                className={`relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-sm font-medium transition-colors duration-300 ${tab === 'email' ? 'text-primary-content' : 'text-base-content/50 hover:text-base-content'
                                    }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                                Email
                            </button>
                            <button
                                type="button"
                                onClick={() => { setTab('phone'); setError(''); dispatch(clearAuthError()) }}
                                disabled={isBusy}
                                className={`relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-sm font-medium transition-colors duration-300 ${tab === 'phone' ? 'text-primary-content' : 'text-base-content/50 hover:text-base-content'
                                    }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                </svg>
                                Mobile OTP
                            </button>
                        </div>

                        <div className="min-h-[220px] flex flex-col justify-start">
                            {tab === 'email' && (
                                <form onSubmit={handleEmailLogin} className="flex flex-col gap-3">
                                    <label className="form-control w-full">
                                        <div className="label"><span className="label-text text-sm">Email</span></div>
                                        <input
                                            type="email"
                                            placeholder="jane@example.com"
                                            className={`input input-bordered w-full ${emailError ? 'input-error' : ''}`}
                                            value={email}
                                            onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError('') }}
                                            onBlur={() => {
                                                const t = email.trim()
                                                if (!t) setEmailError('Email is required')
                                                else if (!emailPattern.test(t)) setEmailError('Please enter a valid email address')
                                                else setEmailError('')
                                            }}
                                            autoComplete="email"
                                            disabled={isBusy}
                                            aria-invalid={Boolean(emailError)}
                                        />
                                        {emailError && <span className="label-text-alt text-error mt-1">{emailError}</span>}
                                    </label>
                                    <label className="form-control w-full">
                                        <div className="label">
                                            <span className="label-text text-sm">Password</span>
                                            <span className="label-text-alt">
                                                <a href="#" className="link link-primary text-xs">Forgot password?</a>
                                            </span>
                                        </div>
                                        <div className="join w-full">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="••••••••"
                                                className={`input input-bordered join-item w-full ${passwordError ? 'input-error' : ''}`}
                                                value={password}
                                                onChange={(e) => { setPassword(e.target.value); if (passwordError) setPasswordError('') }}
                                                onBlur={() => {
                                                    if (!password.trim()) setPasswordError('Password is required')
                                                    else setPasswordError('')
                                                }}
                                                autoComplete="current-password"
                                                minLength={6}
                                                disabled={isBusy}
                                                aria-invalid={Boolean(passwordError)}
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-outline join-item"
                                                onClick={() => setShowPassword(p => !p)}
                                                disabled={isBusy}
                                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                            >
                                                {showPassword ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414L3.707 2.293zM10 4c.34 0 .674.024 1 .07V4a7 7 0 017 7 6.97 6.97 0 01-.7 3.02l-1.47-1.47A5 5 0 0010 6a4.98 4.98 0 00-2.48.66L6.05 5.19A7.02 7.02 0 0110 4zM3.07 10.93A6.97 6.97 0 013 11a7 7 0 007 7 6.97 6.97 0 003.02-.7l-1.47-1.47A5 5 0 015 11c0-.69.14-1.35.38-1.95L3.07 10.93z" clipRule="evenodd" />
                                                    </svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                        {passwordError && <span className="label-text-alt text-error mt-1">{passwordError}</span>}
                                    </label>
                                    <button type="submit" className="btn btn-primary w-full mt-1" disabled={isBusy}>
                                        {isBusy ? (
                                            <span className="inline-flex items-center gap-2">
                                                <span className="loading loading-spinner loading-sm" />
                                                {isRedirecting ? 'Redirecting...' : 'Signing in...'}
                                            </span>
                                        ) : 'Sign In'}
                                    </button>
                                </form>
                            )}

                            {tab === 'phone' && (
                                !otpSent ? (
                                    <form onSubmit={handleSendOtp} className="flex flex-col gap-3">
                                        <label className="form-control w-full">
                                            <div className="label"><span className="label-text text-sm">Mobile Number</span></div>
                                            <div className="join w-full">
                                                <span className="join-item btn btn-outline pointer-events-none">+91</span>
                                                <input
                                                    type="tel"
                                                    placeholder="9876543210"
                                                    className="input input-bordered join-item w-full"
                                                    value={phone}
                                                    onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '')); if (error) setError('') }}
                                                    maxLength={10}
                                                    pattern="[0-9]{10}"
                                                    required
                                                />
                                            </div>
                                        </label>
                                        <button type="submit" className="btn btn-primary w-full" disabled={!isPhoneValid}>Send OTP</button>
                                    </form>
                                ) : (
                                    <form className="flex flex-col gap-3">
                                        <label className="form-control w-full">
                                            <div className="label">
                                                <span className="label-text text-sm">OTP sent to +91 {phone}</span>
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="------"
                                                className="input input-bordered w-full tracking-widest text-center"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                maxLength={6}
                                                pattern="[0-9]{6}"
                                                required
                                                autoFocus
                                            />
                                        </label>
                                        <button type="submit" className="btn btn-primary w-full">Verify OTP</button>
                                        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setOtpSent(false)}>
                                            Change number
                                        </button>
                                    </form>
                                )
                            )}
                        </div>

                        <div className="divider text-xs text-base-content/40 my-0">OR</div>
                        <p className="text-center text-sm text-base-content/60">
                            Don&apos;t have an account?{' '}
                            <button
                                type="button"
                                className="link link-primary font-medium"
                                onClick={() => { setMode('signup'); setError(''); dispatch(clearAuthError()) }}
                            >
                                Sign Up
                            </button>
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Login

