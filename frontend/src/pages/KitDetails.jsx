import { useParams, useNavigate } from "react-router-dom";

import { useGetKitQuery } from "../services/kitApi";

const KitDetails = () => {
    const { kitId } = useParams();
    const navigate = useNavigate();

    const { data, isLoading, isError } = useGetKitQuery(kitId);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-stone-100 px-6 py-10 sm:px-10 lg:px-14">
                <div className="mx-auto max-w-6xl">
                    <div className="h-8 w-40 animate-pulse rounded bg-stone-200" />
                    <div className="mt-8 h-12 w-2/3 animate-pulse rounded bg-stone-200" />
                    <div className="mt-4 h-6 w-1/3 animate-pulse rounded bg-stone-200" />
                    <div className="mt-8 grid gap-4 lg:grid-cols-2">
                        <div className="h-40 animate-pulse rounded-2xl bg-white" />
                        <div className="h-40 animate-pulse rounded-2xl bg-white" />
                    </div>
                    <div className="mt-4 h-60 animate-pulse rounded-2xl bg-white" />
                </div>
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-stone-100 px-6">
                <div className="text-center">
                    <p className="font-serif text-2xl text-stone-900">
                        Unable to load this kit.
                    </p>
                    <p className="mt-2 text-sm text-stone-500">
                        It may have been removed, or there's a connection issue.
                    </p>
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="mt-5 rounded-full bg-stone-950 px-5 py-3 text-sm text-stone-50 transition-colors hover:bg-stone-800"
                    >
                        Back to dashboard
                    </button>
                </div>
            </div>
        );
    }

    const kit = data.kit;
    const source = kit?.source;
    const role = kit?.role;
    const requirements = role?.requirements || [];
    const questions = kit?.questions || [];
    const flashcards = kit?.flashcards || [];
    const schedule = kit?.schedule;
    const coverage = kit?.coverage;

    const uncovered = coverage?.uncovered_requirement_ids?.length || 0;

    const coveredPct = requirements.length > 0
        ? Math.round(((requirements.length - uncovered) / requirements.length) * 100)
        : 0;

    return (
        <div className="min-h-screen bg-stone-100">

            <header className="sticky top-0 z-10 border-b border-stone-200 bg-stone-100/90 backdrop-blur">

                <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-6 sm:px-10 lg:px-14">

                    <button
                        onClick={() => navigate("/dashboard")}
                        className="font-mono text-xs uppercase tracking-wide text-stone-500 transition-colors hover:text-stone-900"
                    >
                        ← Dashboard
                    </button>


                    <div className="flex flex-wrap items-center justify-end gap-3">

                        {flashcards.length > 0 && (
                            <button
                                onClick={() => navigate(`/kit/${kitId}/practice`)}
                                className="rounded-full border border-amber-300 bg-amber-50 px-4 py-2 font-mono text-[10px] uppercase tracking-wide text-amber-700 transition-colors hover:bg-amber-100"
                            >
                                Practice flashcards
                            </button>
                        )}

                        <button
                            onClick={() => navigate(`/kit/${kitId}/edit`)}
                            className="rounded-full bg-stone-950 px-4 py-2 font-mono text-[10px] uppercase tracking-wide text-stone-50 transition-colors hover:bg-stone-800"
                        >
                            Edit kit
                        </button>

                        <span className="rounded-full bg-amber-100 px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-amber-700">
                            {data.status || "draft"}
                        </span>

                    </div>

                </div>

            </header>


            <main className="mx-auto max-w-6xl px-6 py-10 sm:px-10 lg:px-14 lg:py-14">

                {/* HERO */}

                <section>

                    <p className="font-mono text-xs uppercase tracking-widest text-stone-500">
                        Preparation kit
                    </p>

                    <h1 className="mt-3 max-w-4xl font-serif text-4xl leading-tight text-stone-900 sm:text-5xl lg:text-6xl">
                        {role?.title || "Untitled role"}
                    </h1>

                    <p className="mt-4 text-lg text-stone-500">
                        {source?.company || "Company unavailable"}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">

                        {role?.seniority && (
                            <span className="rounded-full bg-stone-900 px-3 py-1.5 font-mono text-xs text-stone-50">
                                {role.seniority}
                            </span>
                        )}

                        <span className="rounded-full bg-white px-3 py-1.5 font-mono text-xs text-stone-500">
                            {requirements.length} requirements
                        </span>

                        <span className="rounded-full bg-white px-3 py-1.5 font-mono text-xs text-stone-500">
                            {questions.length} questions
                        </span>

                        <span className="rounded-full bg-white px-3 py-1.5 font-mono text-xs text-stone-500">
                            {schedule?.days_available || 0} days
                        </span>

                    </div>

                </section>


                {/* COMPANY */}

                <section className="mt-12 grid gap-4 lg:grid-cols-2">

                    <div className="rounded-2xl bg-stone-950 p-7 text-stone-50">

                        <p className="font-mono text-[11px] uppercase tracking-wide text-amber-400">
                            Company brief
                        </p>

                        <h2 className="mt-4 font-serif text-2xl">
                            {kit?.company_brief?.summary || "Company research unavailable"}
                        </h2>

                        <p className="mt-5 text-sm leading-relaxed text-stone-400">
                            {kit?.company_brief?.what_they_do || "No additional company information available."}
                        </p>

                    </div>


                    <div className="rounded-2xl border border-stone-200 bg-white p-7">

                        <p className="font-mono text-[11px] uppercase tracking-wide text-stone-400">
                            Role responsibilities
                        </p>

                        {role?.responsibilities?.length > 0 ? (

                            <div className="mt-5 space-y-3">

                                {role.responsibilities.map((item, index) => (

                                    <div
                                        key={index}
                                        className="flex gap-3 text-sm text-stone-600"
                                    >

                                        <span className="font-mono text-xs text-amber-600">
                                            0{index + 1}
                                        </span>

                                        <span>{item}</span>

                                    </div>

                                ))}

                            </div>

                        ) : (

                            <p className="mt-5 text-sm text-stone-400">
                                No responsibilities listed for this role.
                            </p>

                        )}

                    </div>

                </section>


                {/* REQUIREMENTS */}

                <section className="mt-12">

                    <div className="mb-5">

                        <p className="font-mono text-[11px] uppercase tracking-wide text-stone-400">
                            01 / Requirements
                        </p>

                        <h2 className="mt-2 font-serif text-3xl text-stone-900">
                            What you need to prepare
                        </h2>

                    </div>


                    {requirements.length > 0 ? (

                        <div className="grid gap-3 sm:grid-cols-2">

                            {requirements.map((requirement) => (

                                <div
                                    key={requirement.id}
                                    className="rounded-2xl border border-stone-200 bg-white p-5 transition-shadow hover:shadow-sm"
                                >

                                    <div className="flex items-start justify-between gap-4">

                                        <span className="font-mono text-xs text-stone-400">
                                            {requirement.id}
                                        </span>

                                        <span className={`rounded-full px-2.5 py-1 font-mono text-[10px] uppercase ${
                                            requirement.priority === "must"
                                                ? "bg-amber-100 text-amber-700"
                                                : "bg-stone-100 text-stone-500"
                                        }`}>
                                            {requirement.priority}
                                        </span>

                                    </div>

                                    <p className="mt-4 text-sm leading-relaxed text-stone-800">
                                        {requirement.text}
                                    </p>

                                    <p className="mt-3 font-mono text-[10px] uppercase text-stone-400">
                                        {requirement.kind}
                                    </p>

                                </div>

                            ))}

                        </div>

                    ) : (

                        <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-10 text-center text-sm text-stone-400">
                            No requirements have been extracted for this kit yet.
                        </div>

                    )}

                </section>


                {/* QUESTIONS */}

                <section className="mt-12">

                    <div className="mb-5">

                        <p className="font-mono text-[11px] uppercase tracking-wide text-stone-400">
                            02 / Question bank
                        </p>

                        <h2 className="mt-2 font-serif text-3xl text-stone-900">
                            Interview questions
                        </h2>

                    </div>


                    {questions.length > 0 ? (

                        <div className="space-y-3">

                            {questions.map((question, index) => (

                                <div
                                    key={question.id}
                                    className="rounded-2xl border border-stone-200 bg-white p-6 transition-shadow hover:shadow-sm"
                                >

                                    <div className="flex gap-4">

                                        <span className="font-mono text-xs text-stone-300">
                                            {String(index + 1).padStart(2, "0")}
                                        </span>

                                        <div className="min-w-0 flex-1">

                                            <div className="flex flex-wrap gap-2">

                                                <span className="rounded-full bg-stone-100 px-2.5 py-1 font-mono text-[10px] uppercase text-stone-500">
                                                    {question.category}
                                                </span>

                                                <span className="rounded-full bg-amber-100 px-2.5 py-1 font-mono text-[10px] text-amber-700">
                                                    Difficulty {question.difficulty}
                                                </span>

                                            </div>

                                            <h3 className="mt-4 text-base font-medium leading-relaxed text-stone-900">
                                                {question.prompt}
                                            </h3>

                                            <p className="mt-3 text-sm leading-relaxed text-stone-500">
                                                {question.answer_outline}
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    ) : (

                        <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-10 text-center text-sm text-stone-400">
                            No questions generated for this kit yet.
                        </div>

                    )}

                </section>


                {/* FLASHCARDS */}

                <section className="mt-12">

                    <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                        <div>

                            <p className="font-mono text-[11px] uppercase tracking-wide text-stone-400">
                                03 / Flashcards
                            </p>

                            <h2 className="mt-2 font-serif text-3xl text-stone-900">
                                Quick revision
                            </h2>

                        </div>


                        {flashcards.length > 0 && (
                            <button
                                onClick={() => navigate(`/kit/${kitId}/practice`)}
                                className="self-start rounded-full bg-stone-950 px-5 py-2.5 font-mono text-[10px] uppercase tracking-wide text-stone-50 transition-colors hover:bg-stone-800 sm:self-auto"
                            >
                                Practice flashcards →
                            </button>
                        )}

                    </div>


                    {flashcards.length > 0 ? (

                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

                            {flashcards.map((flashcard) => (

                                <div
                                    key={flashcard.id}
                                    className="rounded-2xl bg-stone-950 p-6 text-stone-50 transition-transform hover:-translate-y-0.5"
                                >

                                    <p className="font-mono text-[10px] uppercase tracking-wide text-amber-400">
                                        {flashcard.id}
                                    </p>

                                    <p className="mt-5 text-sm font-medium leading-relaxed">
                                        {flashcard.front}
                                    </p>

                                    <div className="mt-5 border-t border-stone-800 pt-4">

                                        <p className="text-xs leading-relaxed text-stone-400">
                                            {flashcard.back}
                                        </p>

                                    </div>

                                </div>

                            ))}

                        </div>

                    ) : (

                        <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-10 text-center text-sm text-stone-400">
                            No flashcards generated for this kit yet.
                        </div>

                    )}

                </section>


                {/* SCHEDULE */}

                <section className="mt-12">

                    <div className="mb-5">

                        <p className="font-mono text-[11px] uppercase tracking-wide text-stone-400">
                            04 / Preparation schedule
                        </p>

                        <h2 className="mt-2 font-serif text-3xl text-stone-900">
                            Your preparation plan
                        </h2>

                    </div>


                    {schedule?.days?.length > 0 ? (

                        <div className="space-y-3">

                            {schedule.days.map((day) => (

                                <div
                                    key={day.day}
                                    className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-5 sm:flex-row sm:items-center"
                                >

                                    <span className="font-mono text-xs text-stone-400">
                                        DAY {String(day.day).padStart(2, "0")}
                                    </span>

                                    <div className="flex-1">

                                        <p className="font-medium text-stone-900">
                                            {day.focus}
                                        </p>

                                        <p className="mt-1 text-xs text-stone-400">
                                            {day.question_ids?.length || 0} questions
                                        </p>

                                    </div>

                                    <span className="font-mono text-xs text-stone-500">
                                        {day.minutes} min
                                    </span>

                                </div>

                            ))}

                        </div>

                    ) : (

                        <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-10 text-center text-sm text-stone-400">
                            No preparation schedule has been generated yet.
                        </div>

                    )}

                </section>


                {/* COVERAGE */}

                <section className="mt-12 rounded-2xl bg-stone-950 p-7 text-stone-50">

                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

                        <div>

                            <p className="font-mono text-[11px] uppercase tracking-wide text-amber-400">
                                05 / Coverage
                            </p>

                            <h2 className="mt-2 font-serif text-2xl">
                                Requirement coverage
                            </h2>

                        </div>


                        <div className="text-left sm:text-right">

                            <p className="font-serif text-3xl">
                                {uncovered}
                            </p>

                            <p className="font-mono text-[10px] uppercase text-stone-500">
                                uncovered
                            </p>

                        </div>

                    </div>


                    {requirements.length > 0 && (

                        <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-stone-800">

                            <div
                                className="h-full rounded-full bg-amber-400 transition-all"
                                style={{width: `${coveredPct}%`}}
                            />

                        </div>

                    )}


                    <p className="mt-4 text-sm text-stone-400">
                        Coverage passes completed: {coverage?.passes || 0}
                    </p>

                </section>

            </main>

        </div>
    );
};

export default KitDetails;
