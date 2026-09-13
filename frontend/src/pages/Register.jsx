import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useRegisterMutation } from "../services/authApi";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const [register, { isLoading }] = useRegisterMutation();

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        try {
            await register({ name, email, password }).unwrap();
            navigate("/login");
        } catch (error) {
            setError(error?.data?.message || "Registration failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] bg-neutral-950">

            {/* LEFT / BRAND — hidden on small screens */}
            <div className="hidden lg:flex relative flex-col justify-between overflow-hidden bg-neutral-950 px-12 py-14">
                <div
                    className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full opacity-60 blur-3xl"
                    style={{ background: "radial-gradient(circle at 30% 30%, rgba(16,185,129,0.35), transparent 70%)" }}
                />

                <div className="flex items-center gap-2 font-mono text-xs tracking-wide text-neutral-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20" />
                    AI INTERVIEW PREP KIT
                </div>

                <div className="max-w-sm">
                    <h1 className="mt-6 font-serif text-4xl italic leading-tight text-neutral-50">
                        Prepare before the pressure arrives.
                    </h1>
                    <p className="mt-5 text-base leading-relaxed text-neutral-400">
                        Turn a job description into focused questions, company research,
                        flashcards, and a preparation plan built around the role.
                    </p>

                    <div className="mt-10 border-l-2 border-neutral-800 pl-4 font-mono text-sm leading-loose text-neutral-500">
                        <p><span className="text-emerald-400">Requirement:</span> Strong React experience</p>
                        <p><span className="text-emerald-400">Prep:</span> <span className="text-neutral-600">building question set…</span></p>
                    </div>
                </div>

                <p className="font-mono text-xs text-neutral-600">
                    Your interview preparation starts here.
                </p>
            </div>

            {/* RIGHT / FORM */}
            <div className="flex items-center justify-center bg-neutral-50 px-6 py-12 sm:px-10">
                <div className="w-full max-w-sm">

                    <p className="font-mono text-xs text-neutral-500">New candidate</p>
                    <h2 className="mt-1 font-serif text-3xl font-semibold text-neutral-900">
                        Create your account
                    </h2>
                    <p className="mt-1.5 mb-8 text-sm text-neutral-500">
                        Start building your personalized interview prep kit.
                    </p>

                    {error && (
                        <div className="mb-6 flex items-start gap-2 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            <svg className="mt-0.5 h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6" noValidate>

                        <div>
                            <label htmlFor="name" className="text-sm font-medium text-neutral-900">
                                Name
                            </label>
                            <div className="mt-2 border-b border-neutral-300 focus-within:border-emerald-600 transition-colors">
                                <input
                                    id="name"
                                    type="text"
                                    autoComplete="name"
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    placeholder="Your name"
                                    required
                                    className="w-full bg-transparent py-2 text-base text-neutral-900 placeholder-neutral-400 outline-none sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="text-sm font-medium text-neutral-900">
                                Email
                            </label>
                            <div className="mt-2 border-b border-neutral-300 focus-within:border-emerald-600 transition-colors">
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full bg-transparent py-2 text-base text-neutral-900 placeholder-neutral-400 outline-none sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="text-sm font-medium text-neutral-900">
                                Password
                            </label>
                            <div className="relative mt-2 border-b border-neutral-300 focus-within:border-emerald-600 transition-colors">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    placeholder="Create a password"
                                    required
                                    minLength={8}
                                    className="w-full bg-transparent py-2 pr-8 text-base text-neutral-900 placeholder-neutral-400 outline-none sm:text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((previous) => !previous)}
                                    tabIndex={-1}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-700"
                                >
                                    {showPassword ? (
                                        <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>
                                    ) : (
                                        <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            <p className="mt-1.5 text-xs text-neutral-400">
                                Use at least 8 characters.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex w-full items-center justify-center gap-2 rounded-sm bg-neutral-900 px-4 py-3.5 text-sm font-medium text-neutral-50 transition-colors hover:bg-emerald-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isLoading && (
                                <svg className="h-3.5 w-3.5 animate-spin text-neutral-50" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            )}
                            {isLoading ? "Creating account…" : "Create account"}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-neutral-500">
                        Already have an account?{" "}
                        <Link to="/login" className="font-semibold text-neutral-900 underline underline-offset-2">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;