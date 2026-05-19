import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearAuthError } from "../reducers/auth/authSlice";
import Logo from "../components/Logo";

const SKILL_OPTIONS = [
    "JavaScript",
    "Python",
    "Java",
    "C++",
    "Ruby",
    "Go",
    "Swift",
    "Kotlin",
    "PHP",
    "TypeScript",
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//-------Signup form---------------------------------------------------------------------

function SignupForm({ onSuccess, onSwitchToLogin }) {
    const dispatch = useDispatch();
    const signupStatus = useSelector((state) => state.auth.signup.status);
    const signupError = useSelector((state) => state.auth.signup.error);
    const isBusy = signupStatus === "pending";

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        gender: "",
        age: "",
        about: "",
    });

    const [skills, setSkills] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");

    useEffect(() => {
        if (signupError) setServerError(signupError);
    }, [signupError]);

    useEffect(() => {
        if (!serverError) return;
        const timer = setTimeout(() => {
            setServerError("");
            dispatch(clearAuthError());
        }, 4000);

        return () => clearTimeout(timer);
    }, [dispatch, serverError]);

    function set(field, value) {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    function toggleSkill(skill) {
        setSkills((prev) =>
            prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
        );
    }
    function validate() {
        const e = {};
        if (!form.firstName.trim()) e.firstName = "First name is required";
        if (!form.lastName.trim()) e.lastName = "Last name is required";
        if (!form.email.trim()) e.email = "Email is required";
        else if (emailPattern.test(form.email.trim()))
            e.email = "Enter a valid email";
        if (!form.password.trim()) e.password = "Password is required";
        else if (form.password.trim().length < 6)
            e.password = "Minimum 6 characters";
        if (!form.gender) e.gender = "Gender is required";
        if (!form.age.trim()) e.age = "Age is required";
        if (isNaN(form.age.trim()) || form.age < 13)
            e.age = "Enter a valid age (13+)";
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setServerError("");
        dispatch(clearAuthError());
        if (!validate()) return;

        const result = await dispatch(signupUser({ ...form, skills }));
        if (result.success) onSuccess();
    }

    return (
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            {serverError && (
                <div role="alert" className="alert alert-error py-2 text-sm">
                    <span>⚠️ {serverError}</span>
                </div>
            )}

            {/* Name fields */}
            <div className="flex gap-2">
                <label className="form-control flex-1">
                    <div className="label pb-0.5">
                        <span className="label-text text-xs">First Name</span>
                    </div>
                    <input
                        type="text"
                        placeholder="Elon"
                        value={form.firstName}
                        onChange={(e) => set("firstName", e.target.value)}
                        className={`input input-bordered input-sm w-full ${errors.firstName ? "input-error" : ""
                            }`}
                        disabled={isBusy}
                    />
                    {errors.firstName && (
                        <span className="label-text-alt text-error text-xs mt-0.5">
                            {errors.firstName}
                        </span>
                    )}
                </label>
                <label className="form-control flex-1">
                    <div className="label pb-0.5">
                        <span className="label-text text-xs">Last Name</span>
                    </div>
                    <input
                        type="text"
                        placeholder="Musk"
                        value={form.lastName}
                        onChange={(e) => set("lastName", e.target.value)}
                        className={`input input-bordered input-sm w-full ${errors.lastName ? "input-error" : ""
                            }`}
                        disabled={isBusy}
                    />
                    {errors.lastName && (
                        <span className="label-text-alt text-error text-xs mt-0.5">
                            {errors.lastName}
                        </span>
                    )}
                </label>
            </div>

            {/* Email */}

            <label className="form-control w-full">
                <div className="label pb-0.5">
                    <span className="label-text text-xs">Email</span>
                </div>
                <input
                    type="email"
                    placeholder="elon@example.com"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    className={`input input-bordered input-sm w-full ${errors.email ? "input-error" : ""
                        }`}
                    disabled={isBusy}
                    autoComplete="email"
                />
                {errors.email && (
                    <span className="label-text-alt text-error text-xs mt-0.5">
                        {errors.email}
                    </span>
                )}
            </label>

            {/* Password */}
            <label className="form-control w-full">
                <div className="label pb-0.5">
                    <span className="label-text text-xs">Password *</span>
                </div>

                <div className="join w-full">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className={`input input-bordered input-sm join-item w-full ${errors.password ? "input-error" : ""
                            }`}
                        value={form.password}
                        onChange={(e) => set("password", e.target.value)}
                        autoComplete="new-password"
                        disabled={isBusy}
                    />

                    <button
                        type="button"
                        className="btn btn-outline btn-sm join-item"
                        onClick={() => setShowPassword((p) => !p)}
                        disabled={isBusy}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414L3.707 2.293zm10 4c.34 0 .674.024 1.07.07 7 0 017 6.97 6.97 6.97 0 01-7 7 0 007-7 6.97 6.97 0 003.02-.71-1.47-1.47A5 5 0 015 11c0-.69.14-1.35.38-1.95L3.07 10.93z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path
                                    fillRule="evenodd"
                                    d="M.458 10C1.732 5.943 5.523 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        )}
                    </button>
                </div>

                {errors.password && (
                    <span className="label-text-alt text-error text-xs mt-0.5">
                        {errors.password}
                    </span>
                )}
            </label>

            {/* Gender + Age */}
            <div className="flex gap-2">
                <label className="form-control flex-1">
                    <div className="label pb-0.5">
                        <span className="label-text text-xs">Gender</span>
                    </div>

                    <select
                        className={`select select-bordered select-sm w-full ${errors.gender ? "select-error" : ""
                            }`}
                        value={form.gender}
                        onChange={(e) => set("gender", e.target.value)}
                        disabled={isBusy}
                    >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Male">Female</option>
                        <option value="Male">Other</option>
                    </select>

                    {errors.gender && (
                        <span className="label-text-alt text-error text-xs mt-0.5">
                            {errors.gender}
                        </span>
                    )}
                </label>

                <label className="form-control flex-1">
                    <div className="label pb-0.5">
                        <span className="label-text text-xs">Age</span>
                    </div>
                    <input
                        type="number"
                        placeholder="18"
                        value={form.age}
                        onChange={(e) => set("age", e.target.value)}
                        className={`input input-bordered input-sm w-full ${errors.age ? "input-error" : ""
                            }`}
                        min={13}
                        max={80}
                        disabled={isBusy}
                    />
                    {errors.age && (
                        <span className="label-text-alt text-error text-xs mt-0.5">
                            {errors.age}
                        </span>
                    )}
                </label>
            </div>

            {/* About */}
            <label className="form-control w-full">
                <div className="label pb-0.5">
                    <span className="label-text text-xs">About</span>
                </div>
                <textarea
                    placeholder="Tell developers about yourself..."
                    value={form.about}
                    onChange={(e) => set("about", e.target.value)}
                    className="textarea textarea-bordered textarea-sm w-full"
                    disabled={isBusy}
                    rows={2}
                />
            </label>

            {/* Skills */}
            {/* Skills */}
            <div>
                <p className="label-text text-xs mb-1.5">Skills</p>

                <div className="flex flex-wrap gap-1.5">
                    {SKILL_OPTIONS.map((skill) => (
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

            <button
                type="submit"
                className="btn btn-primary w-full mt-1"
                disabled={isBusy}
            >
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
                <button
                    type="button"
                    className="link link-primary font-medium"
                    onClick={onSwitchToLogin}
                >
                    Sign In
                </button>
            </p>
        </form>
    );
}

function LoginPage() {
    const [mode, setMode] = useState("login"); // 'login' | 'signup'
    const [tab, setTab] = useState("email"); // 'email' | 'phone'
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [error, setError] = useState("");
    const [isRedirecting, setIsRedirecting] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loginStatus = useSelector((state) => state.auth.login.status);
    const loginError = useSelector((state) => state.auth.login.error);

    const phonePattern = /^\d{10}$/;
    const isPhoneValid = phonePattern.test(phone.trim());
    const isBusy = loginStatus === "pending" || isRedirecting;

    useEffect(() => {
        if (!loginError) return;
        setError(loginError);
    }, [loginError]);

    useEffect(() => {
        if (!error) return;
        const timer = setTimeout(() => {
            setError("");
            dispatch(clearAuthError());
        }, 4000);

        return () => clearTimeout(timer);
    }, [error]);

    function validateEmailLogin() {
        let valid = true;
        const trimmedEmail = email.trim();
        if (!trimmedEmail) {
            setEmailError("Email is required");
            valid = false;
        } else if (!emailPattern.test(trimmedEmail)) {
            setEmailError("Please enter a valid email address");
            valid = false;
        } else {
            setEmailError("");
        }
        if (!password.trim()) {
            setPasswordError("Password is required");
            valid = false;
        } else {
            setPasswordError("");
        }
        return valid;
    }

    async function handleEmailLogin(e) {
        e.preventDefault();
        setError("");
        dispatch(clearAuthError());
        if (!validateEmailLogin()) return;

        const result = await dispatch(
            loginUser({ email: email.trim(), password: password.trim() })
        );
        if (result.success) {
            setIsRedirecting(true);
            await new Promise((resolve) => setTimeout(resolve, 700));
            navigate("/");
            setIsRedirecting(false);
        }
    }

    async function handleSendOtp(e) {
        e.preventDefault();
        setError("");
        dispatch(clearAuthError());
        if (!isPhoneValid) {
            setError("Please enter a valid 10-digit phone number");
            return;
        }
        // Simulate OTP sending
        setOtpSent(true);
    }

    async function handleSignupSuccess() {
        setIsRedirecting(true);
        await new Promise((resolve) => setTimeout(resolve, 700));
        navigate("/");
        setIsRedirecting(false);
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 px-4 py-8 gap-6">
            {error && (
                <div className="toast toast-top toast-end z-50">
                    <div role="alert" className="alert alert-error shadow-lg">
                        <span>⚠️ {error}</span>
                        <button
                            className="btn btn-xs btn-ghost"
                            aria-label="Dismiss error"
                            onClick={() => {
                                setError("");
                                dispatch(clearAuthError());
                            }}
                        >
                            {" "}
                            ❌
                        </button>
                    </div>
                </div>
            )}

            {isRedirecting && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-base-100/75 backdrop-blur-sm">
                    <div className="flex items-center gap-3 rounded-xl bg-base-100 px-5 py-4 shadow-xl">
                        <span className="loading loading-spinner loading-md text-primary"></span>
                        <span className="text-sm font-medium">
                            {mode === "login" ? "Logging in..." : "Creating account..."}
                        </span>
                    </div>
                </div>
            )}

            <Logo size="lg" />

            {/* ---Signup card --- */}
            {mode === "signup" && (
                <div className="card w-full max-w-sm bg-base-100 shadow-xl">
                    <div className="card-body gap-4">
                        <h2 className="card-title text-2xl font-bold justify-center">
                            Create Account
                        </h2>
                        <p className="text-center text-base-content/60 text-sm -mt-2">
                            Join the developer community
                        </p>
                        <SignupForm
                            onSuccess={handleSignupSuccess}
                            onSwitchToLogin={() => {
                                setMode("login");
                                dispatch(clearAuthError());
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
