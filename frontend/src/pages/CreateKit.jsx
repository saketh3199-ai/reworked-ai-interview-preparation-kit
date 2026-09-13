
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCreateKitMutation } from "../services/kitApi";

const CreateKit = () =>
{
    const [jd, setJd] = useState("");
    const [companyUrl, setCompanyUrl] = useState("");
    const [days, setDays] = useState(5);
    const [error, setError] = useState("");

    const [createKit, { isLoading }] = useCreateKitMutation();

    const navigate = useNavigate();

    const handleSubmit = async (event) =>
    {
        event.preventDefault();
        setError("");

        try
        {
            const response = await createKit
            (
                {
                    jd,
                    company_url: companyUrl,
                    days: Number(days)
                }
            ).unwrap();

            navigate(`/kit/${response.kitId}`);
        }
        catch (error)
        {
            setError(error?.data?.message || "Unable to create your preparation kit.");
        }
    };

    return (
        <div className="min-h-screen bg-neutral-950">

            <header className="border-b border-neutral-800">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 sm:px-8">

                    <div className="flex items-center gap-2 font-mono text-xs tracking-wide text-neutral-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20" />
                        AI INTERVIEW PREP KIT
                    </div>

                    <button
                        onClick={() => navigate("/dashboard")}
                        className="text-sm text-neutral-400 transition-colors hover:text-neutral-50"
                    >
                        Dashboard
                    </button>

                </div>
            </header>

            <main className="mx-auto max-w-6xl px-6 py-10 sm:px-8 sm:py-14">

                <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_0.6fr]">

                    <section>

                        <p className="font-mono text-xs text-neutral-500">
                            New preparation kit
                        </p>

                        <h1 className="mt-2 font-serif text-4xl italic text-neutral-50 sm:text-5xl">
                            Start with the role.
                        </h1>

                        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-400 sm:text-base">
                            Give us the job description and company website.
                            We'll turn them into focused interview preparation.
                        </p>

                        {error && (
                            <div className="mt-8 rounded-sm border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="mt-10 space-y-8">

                            <div>
                                <label
                                    htmlFor="jd"
                                    className="text-sm font-medium text-neutral-200"
                                >
                                    Job description
                                </label>

                                <textarea
                                    id="jd"
                                    value={jd}
                                    onChange={(event) => setJd(event.target.value)}
                                    placeholder="Paste the complete job description here..."
                                    required
                                    rows={12}
                                    className="mt-3 w-full resize-y border border-neutral-800 bg-neutral-900 px-4 py-4 text-sm leading-relaxed text-neutral-200 outline-none transition-colors placeholder-neutral-600 focus:border-emerald-500"
                                />

                                <p className="mt-2 text-xs text-neutral-600">
                                    {jd.length} characters
                                </p>
                            </div>

                            <div>
                                <label
                                    htmlFor="companyUrl"
                                    className="text-sm font-medium text-neutral-200"
                                >
                                    Company website
                                </label>

                                <input
                                    id="companyUrl"
                                    type="url"
                                    value={companyUrl}
                                    onChange={(event) => setCompanyUrl(event.target.value)}
                                    placeholder="https://www.company.com"
                                    required
                                    className="mt-3 w-full border-b border-neutral-700 bg-transparent px-0 py-3 text-sm text-neutral-200 outline-none transition-colors placeholder-neutral-600 focus:border-emerald-500"
                                />
                            </div>

                            <div className="max-w-xs">
                                <label
                                    htmlFor="days"
                                    className="text-sm font-medium text-neutral-200"
                                >
                                    Preparation days
                                </label>

                                <input
                                    id="days"
                                    type="number"
                                    min="1"
                                    max="60"
                                    value={days}
                                    onChange={(event) => setDays(event.target.value)}
                                    required
                                    className="mt-3 w-full border-b border-neutral-700 bg-transparent px-0 py-3 text-sm text-neutral-200 outline-none transition-colors focus:border-emerald-500"
                                />

                                <p className="mt-2 text-xs text-neutral-600">
                                    Choose between 1 and 60 days.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex w-full items-center justify-center gap-2 rounded-sm bg-neutral-50 px-5 py-3.5 text-sm font-medium text-neutral-900 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-52"
                            >
                                {isLoading && (
                                    <svg
                                        className="h-4 w-4 animate-spin"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />

                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                        />
                                    </svg>
                                )}

                                {isLoading ? "Building your kit…" : "Build preparation kit"}
                            </button>

                        </form>

                    </section>

                    <aside className="self-start border border-neutral-800 bg-neutral-900/40 p-6">

                        <p className="font-mono text-xs uppercase tracking-wide text-emerald-400">
                            What happens next
                        </p>

                        <div className="mt-6 space-y-6">

                            <div>
                                <p className="font-mono text-xs text-neutral-600">
                                    01
                                </p>
                                <p className="mt-1 text-sm font-medium text-neutral-200">
                                    Analyze the role
                                </p>
                                <p className="mt-1 text-xs leading-relaxed text-neutral-500">
                                    Requirements and job information are extracted from the JD.
                                </p>
                            </div>

                            <div>
                                <p className="font-mono text-xs text-neutral-600">
                                    02
                                </p>
                                <p className="mt-1 text-sm font-medium text-neutral-200">
                                    Research the company
                                </p>
                                <p className="mt-1 text-xs leading-relaxed text-neutral-500">
                                    The company website and public interview information are researched.
                                </p>
                            </div>

                            <div>
                                <p className="font-mono text-xs text-neutral-600">
                                    03
                                </p>
                                <p className="mt-1 text-sm font-medium text-neutral-200">
                                    Build your preparation
                                </p>
                                <p className="mt-1 text-xs leading-relaxed text-neutral-500">
                                    Questions, flashcards, coverage checks and a preparation schedule are generated.
                                </p>
                            </div>

                        </div>

                    </aside>

                </div>

            </main>

        </div>
    );
};

export default CreateKit;

