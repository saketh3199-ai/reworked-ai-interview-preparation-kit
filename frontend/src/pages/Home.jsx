
import { Link } from "react-router-dom";

const Home = () =>
{
    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-50">

            <header className="border-b border-neutral-800">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 sm:px-8">

                    <div className="flex items-center gap-2 font-mono text-xs tracking-wide text-neutral-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20" />
                        AI INTERVIEW PREP KIT
                    </div>

                    <div className="flex items-center gap-5">
                        <Link
                            to="/login"
                            className="text-sm text-neutral-400 transition-colors hover:text-neutral-50"
                        >
                            Sign in
                        </Link>

                        <Link
                            to="/register"
                            className="rounded-sm bg-neutral-50 px-4 py-2.5 text-sm font-medium text-neutral-900 transition-colors hover:bg-emerald-400"
                        >
                            Create account
                        </Link>
                    </div>

                </div>
            </header>

            <main className="mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-28">

                <section className="max-w-3xl">

                    <p className="font-mono text-xs uppercase tracking-widest text-emerald-400">
                        Interview preparation, focused
                    </p>

                    <h1 className="mt-5 font-serif text-5xl italic leading-tight text-neutral-50 sm:text-7xl">
                        Prepare before the pressure arrives.
                    </h1>

                    <p className="mt-6 max-w-2xl text-base leading-relaxed text-neutral-400 sm:text-lg">
                        Turn a job description and company website into focused interview
                        questions, flashcards, company research, and a preparation schedule.
                    </p>

                    <div className="mt-9 flex flex-col gap-3 sm:flex-row">

                        <Link
                            to="/register"
                            className="rounded-sm bg-neutral-50 px-6 py-3.5 text-center text-sm font-medium text-neutral-900 transition-colors hover:bg-emerald-400"
                        >
                            Build your prep kit
                        </Link>

                        <Link
                            to="/login"
                            className="rounded-sm border border-neutral-700 px-6 py-3.5 text-center text-sm font-medium text-neutral-300 transition-colors hover:border-neutral-500 hover:text-neutral-50"
                        >
                            Sign in
                        </Link>

                    </div>

                </section>

                <section className="mt-20 grid grid-cols-1 gap-px border border-neutral-800 bg-neutral-800 md:grid-cols-3">

                    <div className="bg-neutral-950 p-6">
                        <p className="font-mono text-xs text-neutral-500">
                            01
                        </p>

                        <h2 className="mt-4 text-lg font-medium">
                            Analyze the role
                        </h2>

                        <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                            Extract the important technical and behavioural requirements
                            from the job description.
                        </p>
                    </div>

                    <div className="bg-neutral-950 p-6">
                        <p className="font-mono text-xs text-neutral-500">
                            02
                        </p>

                        <h2 className="mt-4 text-lg font-medium">
                            Build your questions
                        </h2>

                        <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                            Generate targeted interview questions and preparation material
                            around the role.
                        </p>
                    </div>

                    <div className="bg-neutral-950 p-6">
                        <p className="font-mono text-xs text-neutral-500">
                            03
                        </p>

                        <h2 className="mt-4 text-lg font-medium">
                            Practice with purpose
                        </h2>

                        <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                            Follow a structured preparation schedule and test yourself
                            with focused practice.
                        </p>
                    </div>

                </section>

            </main>

        </div>
    );
};

export default Home;

