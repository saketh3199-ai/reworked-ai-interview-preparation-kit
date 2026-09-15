
import { useParams, useNavigate } from "react-router-dom";

import { useGetKitQuery } from "../services/kitApi";

const KitDetails = () => {
    const { kitId } = useParams();
    const navigate = useNavigate();

    const { data, isLoading, isError } = useGetKitQuery(kitId);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#f7f6f2] px-4 py-6 sm:px-6 lg:px-10">
                <div className="mx-auto max-w-7xl">
                    <div className="h-10 w-32 animate-pulse rounded-full bg-stone-200" />
                    <div className="mt-10 h-12 w-full max-w-2xl animate-pulse rounded-xl bg-stone-200 sm:h-16" />
                    <div className="mt-4 h-6 w-48 animate-pulse rounded bg-stone-200" />

                    <div className="mt-8 grid gap-4 lg:grid-cols-3">
                        <div className="h-32 animate-pulse rounded-3xl bg-white" />
                        <div className="h-32 animate-pulse rounded-3xl bg-white" />
                        <div className="h-32 animate-pulse rounded-3xl bg-white" />
                    </div>

                    <div className="mt-5 h-72 animate-pulse rounded-3xl bg-white" />
                </div>
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f7f6f2] px-6">
                <div className="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-8 text-center shadow-sm">

                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                        !
                    </div>

                    <p className="mt-5 font-serif text-2xl text-stone-900">
                        Unable to load this kit.
                    </p>

                    <p className="mt-2 text-sm leading-relaxed text-stone-500">
                        It may have been removed, or there may be a connection issue.
                    </p>

                    <button
                        onClick={() => navigate("/dashboard")}
                        className="mt-6 w-full rounded-full bg-stone-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
                    >
                        Back to dashboard
                    </button>

                </div>
            </div>
        );
    }

    const kit = data.kit || {};
    const source = kit.source || {};
    const role = kit.role || {};

    const requirements = Array.isArray(role.requirements)
        ? role.requirements
        : [];

    const questions = Array.isArray(kit.questions)
        ? kit.questions
        : [];

    const flashcards = Array.isArray(kit.flashcards)
        ? kit.flashcards
        : [];

    const schedule = kit.schedule || {};
    const coverage = kit.coverage || {};

    const interviewResearch =
        data.research?.interview &&
        typeof data.research.interview === "object"
            ? data.research.interview
            : {};

    const companySources = Array.isArray(kit.company_brief?.sources)
        ? kit.company_brief.sources
        : [];

    const pagesUsed = Array.isArray(source.pages_used)
        ? source.pages_used
        : [];

    const interviewSources = Array.isArray(interviewResearch.sources)
        ? interviewResearch.sources
        : Array.isArray(interviewResearch.results)
            ? interviewResearch.results
            : [];

    const interviewQueryCount =
        interviewResearch.summary?.query_count ||
        interviewResearch.queries?.length ||
        0;

    const interviewSourceCount =
        interviewResearch.summary?.source_count ||
        interviewSources.length ||
        0;

    const uncovered =
        Array.isArray(coverage.uncovered_requirement_ids)
            ? coverage.uncovered_requirement_ids.length
            : 0;

    const coveredPct = requirements.length > 0
        ? Math.round(
            ((requirements.length - uncovered) / requirements.length) * 100
        )
        : 0;

    return (
        <div className="min-h-screen bg-[#f7f6f2] text-stone-900">

            {/* HEADER */}

            <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-[#f7f6f2]/95 backdrop-blur-xl">

                <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">

                    <button
                        onClick={() => navigate("/dashboard")}
                        className="self-start rounded-full border border-stone-200 bg-white px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-stone-500 transition hover:border-stone-300 hover:text-stone-900"
                    >
                        ← Dashboard
                    </button>

                    <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">

                        {flashcards.length > 0 && (
                            <button
                                onClick={() => navigate(`/kit/${kitId}/practice`)}
                                className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-amber-700 transition hover:bg-amber-100"
                            >
                                Practice
                            </button>
                        )}

                        <button
                            onClick={() => navigate(`/kit/${kitId}/edit`)}
                            className="rounded-full bg-stone-950 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-white transition hover:bg-stone-800"
                        >
                            Edit kit
                        </button>

                        <span className="rounded-full bg-stone-200 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-stone-600">
                            {data.status || "draft"}
                        </span>

                    </div>

                </div>

            </header>


            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-14">

                {/* KIT OVERVIEW */}

                <section>

                    <div className="flex flex-wrap items-center gap-2">

                        <span className="rounded-full bg-stone-900 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-white">
                            Preparation kit
                        </span>

                        {role.seniority && (
                            <span className="rounded-full bg-amber-100 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-amber-700">
                                {role.seniority}
                            </span>
                        )}

                    </div>


                    <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_320px] lg:items-end">

                        <div>

                            <h1 className="max-w-4xl font-serif text-4xl leading-[1.05] tracking-tight text-stone-950 sm:text-5xl lg:text-6xl">
                                {role.title || "Untitled role"}
                            </h1>

                            <p className="mt-4 text-lg font-medium text-stone-500 sm:text-xl">
                                {source.company || "Company unavailable"}
                            </p>

                            {source.company_url && (
                                <a
                                    href={source.company_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-3 inline-block max-w-full break-all text-xs text-stone-400 transition hover:text-amber-700"
                                >
                                    {source.company_url} ↗
                                </a>
                            )}

                        </div>


                        <div className="rounded-3xl bg-stone-950 p-5 text-white sm:p-6">

                            <div className="flex items-center justify-between gap-4">

                                <div>

                                    <p className="font-mono text-[9px] uppercase tracking-widest text-stone-500">
                                        Preparation status
                                    </p>

                                    <p className="mt-2 font-serif text-2xl">
                                        {coveredPct}% covered
                                    </p>

                                </div>

                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-amber-400/30 bg-amber-400/10">

                                    <span className="font-mono text-xs text-amber-400">
                                        {coveredPct}%
                                    </span>

                                </div>

                            </div>


                            <div className="mt-5 h-2 overflow-hidden rounded-full bg-stone-800">

                                <div
                                    className="h-full rounded-full bg-amber-400 transition-all"
                                    style={{width: `${coveredPct}%`}}
                                />

                            </div>


                            <p className="mt-3 text-xs leading-5 text-stone-500">
                                {uncovered > 0
                                    ? `${uncovered} requirement${uncovered === 1 ? "" : "s"} still need better question coverage.`
                                    : "All extracted requirements are covered by the question bank."}
                            </p>

                        </div>

                    </div>


                    <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">

                        <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5">

                            <p className="font-mono text-[9px] uppercase tracking-widest text-stone-400">
                                Requirements
                            </p>

                            <p className="mt-2 text-2xl font-semibold text-stone-900">
                                {requirements.length}
                            </p>

                            <p className="mt-1 text-[10px] text-stone-400">
                                extracted from JD
                            </p>

                        </div>


                        <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5">

                            <p className="font-mono text-[9px] uppercase tracking-widest text-stone-400">
                                Questions
                            </p>

                            <p className="mt-2 text-2xl font-semibold text-stone-900">
                                {questions.length}
                            </p>

                            <p className="mt-1 text-[10px] text-stone-400">
                                in question bank
                            </p>

                        </div>


                        <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5">

                            <p className="font-mono text-[9px] uppercase tracking-widest text-stone-400">
                                Flashcards
                            </p>

                            <p className="mt-2 text-2xl font-semibold text-stone-900">
                                {flashcards.length}
                            </p>

                            <p className="mt-1 text-[10px] text-stone-400">
                                for quick revision
                            </p>

                        </div>


                        <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5">

                            <p className="font-mono text-[9px] uppercase tracking-widest text-stone-400">
                                Preparation
                            </p>

                            <p className="mt-2 text-2xl font-semibold text-stone-900">
                                {schedule.days_available || 0}
                            </p>

                            <p className="mt-1 text-[10px] text-stone-400">
                                days available
                            </p>

                        </div>

                    </div>


                    <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">

                        <div>

                            <p className="font-mono text-[9px] uppercase tracking-widest text-stone-400">
                                Recommended next step
                            </p>

                            <p className="mt-1 text-sm font-medium text-stone-800">
                                Start practicing the generated interview questions.
                            </p>

                        </div>

                        {flashcards.length > 0 && (
                            <button
                                onClick={() => navigate(`/kit/${kitId}/practice`)}
                                className="w-full rounded-full bg-stone-950 px-5 py-2.5 font-mono text-[10px] uppercase tracking-widest text-white transition hover:bg-stone-800 sm:w-auto"
                            >
                                Start practice →
                            </button>
                        )}

                    </div>

                </section>


                {/* COMPANY */}

                <section className="mt-10 grid gap-4 lg:grid-cols-5">

                    <div className="rounded-3xl bg-stone-950 p-6 text-white sm:p-8 lg:col-span-3">

                        <div className="flex items-center justify-between gap-4">

                            <p className="font-mono text-[10px] uppercase tracking-widest text-amber-400">
                                Company brief
                            </p>

                            <span className="rounded-full bg-white/10 px-3 py-1 font-mono text-[9px] uppercase tracking-widest text-stone-400">
                                Research
                            </span>

                        </div>

                        <h2 className="mt-6 max-w-2xl font-serif text-2xl leading-snug sm:text-3xl">
                            {kit.company_brief?.summary || "Company research unavailable"}
                        </h2>

                        <p className="mt-5 max-w-2xl text-sm leading-7 text-stone-400">
                            {kit.company_brief?.what_they_do || "No additional company information available."}
                        </p>

                    </div>


                    <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 lg:col-span-2">

                        <p className="font-mono text-[10px] uppercase tracking-widest text-stone-400">
                            Role responsibilities
                        </p>

                        {role.responsibilities?.length > 0 ? (

                            <div className="mt-6 space-y-4">

                                {role.responsibilities.map((item, index) => (

                                    <div
                                        key={index}
                                        className="flex gap-3"
                                    >

                                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-50 font-mono text-[9px] text-amber-700">
                                            {String(index + 1).padStart(2, "0")}
                                        </span>

                                        <span className="text-sm leading-6 text-stone-600">
                                            {item}
                                        </span>

                                    </div>

                                ))}

                            </div>

                        ) : (

                            <p className="mt-6 text-sm text-stone-400">
                                No responsibilities listed for this role.
                            </p>

                        )}

                    </div>

                </section>


                {/* REQUIREMENTS */}

                <section className="mt-14">

                    <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

                        <div>

                            <p className="font-mono text-[10px] uppercase tracking-widest text-amber-600">
                                01 / Requirements
                            </p>

                            <h2 className="mt-2 font-serif text-3xl tracking-tight text-stone-950 sm:text-4xl">
                                What you need to prepare
                            </h2>

                        </div>

                        <p className="text-sm text-stone-400">
                            {requirements.length} extracted requirements
                        </p>

                    </div>


                    {requirements.length > 0 ? (

                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

                            {requirements.map((requirement) => (

                                <div
                                    key={requirement.id}
                                    className="group rounded-2xl border border-stone-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-md"
                                >

                                    <div className="flex items-start justify-between gap-3">

                                        <span className="font-mono text-[10px] uppercase tracking-widest text-stone-300">
                                            {requirement.id}
                                        </span>

                                        <span
                                            className={`rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-wide ${
                                                requirement.priority === "must"
                                                    ? "bg-amber-100 text-amber-700"
                                                    : "bg-stone-100 text-stone-500"
                                            }`}
                                        >
                                            {requirement.priority}
                                        </span>

                                    </div>

                                    <p className="mt-5 text-sm leading-6 text-stone-800">
                                        {requirement.text}
                                    </p>

                                    <div className="mt-5 border-t border-stone-100 pt-3">

                                        <span className="font-mono text-[9px] uppercase tracking-widest text-stone-400">
                                            {requirement.kind}
                                        </span>

                                    </div>

                                </div>

                            ))}

                        </div>

                    ) : (

                        <div className="rounded-3xl border border-dashed border-stone-300 bg-white px-6 py-12 text-center text-sm text-stone-400">
                            No requirements have been extracted for this kit yet.
                        </div>

                    )}

                </section>


                {/* QUESTIONS */}

                <section className="mt-14">

                    <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

                        <div>

                            <p className="font-mono text-[10px] uppercase tracking-widest text-amber-600">
                                02 / Question bank
                            </p>

                            <h2 className="mt-2 font-serif text-3xl tracking-tight text-stone-950 sm:text-4xl">
                                Interview questions
                            </h2>

                        </div>

                        <p className="text-sm text-stone-400">
                            {questions.length} questions
                        </p>

                    </div>


                    {questions.length > 0 ? (

                        <div className="space-y-3">

                            {questions.map((question, index) => (

                                <div
                                    key={question.id}
                                    className="rounded-2xl border border-stone-200 bg-white p-5 transition hover:border-stone-300 hover:shadow-sm sm:p-6"
                                >

                                    <div className="flex gap-4">

                                        <span className="pt-1 font-mono text-[10px] text-stone-300">
                                            {String(index + 1).padStart(2, "0")}
                                        </span>

                                        <div className="min-w-0 flex-1">

                                            <div className="flex flex-wrap gap-2">

                                                <span className="rounded-full bg-stone-100 px-2.5 py-1 font-mono text-[9px] uppercase tracking-wide text-stone-500">
                                                    {question.category}
                                                </span>

                                                <span className="rounded-full bg-amber-50 px-2.5 py-1 font-mono text-[9px] uppercase tracking-wide text-amber-700">
                                                    Difficulty {question.difficulty}
                                                </span>

                                            </div>

                                            <h3 className="mt-4 text-sm font-semibold leading-6 text-stone-900 sm:text-base">
                                                {question.prompt}
                                            </h3>

                                            {question.answer_outline && (
                                                <div className="mt-4 rounded-xl bg-stone-50 p-4">

                                                    <p className="font-mono text-[9px] uppercase tracking-widest text-stone-400">
                                                        Answer outline
                                                    </p>

                                                    <p className="mt-2 text-sm leading-6 text-stone-500">
                                                        {question.answer_outline}
                                                    </p>

                                                </div>
                                            )}

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    ) : (

                        <div className="rounded-3xl border border-dashed border-stone-300 bg-white px-6 py-12 text-center text-sm text-stone-400">
                            No questions generated for this kit yet.
                        </div>

                    )}

                </section>


                {/* FLASHCARDS */}

                <section className="mt-14">

                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                        <div>

                            <p className="font-mono text-[10px] uppercase tracking-widest text-amber-600">
                                03 / Flashcards
                            </p>

                            <h2 className="mt-2 font-serif text-3xl tracking-tight text-stone-950 sm:text-4xl">
                                Quick revision
                            </h2>

                        </div>

                        {flashcards.length > 0 && (
                            <button
                                onClick={() => navigate(`/kit/${kitId}/practice`)}
                                className="self-start rounded-full bg-stone-950 px-5 py-2.5 font-mono text-[10px] uppercase tracking-widest text-white transition hover:bg-stone-800 sm:self-auto"
                            >
                                Practice →
                            </button>
                        )}

                    </div>


                    {flashcards.length > 0 ? (

                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

                            {flashcards.map((flashcard) => (

                                <div
                                    key={flashcard.id}
                                    className="rounded-3xl bg-stone-950 p-6 text-white transition hover:-translate-y-1"
                                >

                                    <p className="font-mono text-[9px] uppercase tracking-widest text-amber-400">
                                        {flashcard.id}
                                    </p>

                                    <p className="mt-6 text-sm font-semibold leading-6">
                                        {flashcard.front}
                                    </p>

                                    <div className="mt-6 border-t border-white/10 pt-5">

                                        <p className="text-xs leading-6 text-stone-400">
                                            {flashcard.back}
                                        </p>

                                    </div>

                                </div>

                            ))}

                        </div>

                    ) : (

                        <div className="rounded-3xl border border-dashed border-stone-300 bg-white px-6 py-12 text-center text-sm text-stone-400">
                            No flashcards generated for this kit yet.
                        </div>

                    )}

                </section>


                {/* SCHEDULE */}

                <section className="mt-14">

                    <div className="mb-6">

                        <p className="font-mono text-[10px] uppercase tracking-widest text-amber-600">
                            04 / Preparation schedule
                        </p>

                        <h2 className="mt-2 font-serif text-3xl tracking-tight text-stone-950 sm:text-4xl">
                            Your preparation plan
                        </h2>

                    </div>


                    {schedule.days?.length > 0 ? (

                        <div className="space-y-3">

                            {schedule.days.map((day) =>
                            {
                                const dayQuestions = (day.question_ids || [])
                                    .map((questionId) =>
                                        questions.find((question) => question.id === questionId)
                                    )
                                    .filter(Boolean);

                                return (
                                    <div
                                        key={day.day}
                                        className="rounded-3xl border border-stone-200 bg-white p-5 sm:p-6"
                                    >

                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                            <div className="flex gap-4">

                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-950 font-mono text-[10px] text-white">
                                                    {String(day.day).padStart(2, "0")}
                                                </div>

                                                <div>

                                                    <p className="font-semibold text-stone-900">
                                                        {day.focus}
                                                    </p>

                                                    <p className="mt-1 text-xs text-stone-400">
                                                        {dayQuestions.length}{" "}
                                                        {dayQuestions.length === 1
                                                            ? "question"
                                                            : "questions"}
                                                    </p>

                                                </div>

                                            </div>

                                            <span className="self-start rounded-full bg-amber-50 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide text-amber-700 sm:self-auto">
                                                {day.minutes} min
                                            </span>

                                        </div>


                                        {dayQuestions.length > 0 ? (

                                            <div className="mt-5 space-y-2 border-t border-stone-100 pt-5">

                                                {dayQuestions.map((question, index) => (

                                                    <div
                                                        key={question.id}
                                                        className="flex gap-3 rounded-xl bg-stone-50 px-4 py-3"
                                                    >

                                                        <span className="font-mono text-[9px] text-stone-300">
                                                            {String(index + 1).padStart(2, "0")}
                                                        </span>

                                                        <p className="text-sm leading-6 text-stone-600">
                                                            {question.prompt}
                                                        </p>

                                                    </div>

                                                ))}

                                            </div>

                                        ) : (

                                            <p className="mt-5 border-t border-stone-100 pt-5 text-sm text-stone-400">
                                                Review previously studied material.
                                            </p>

                                        )}

                                    </div>
                                );
                            })}

                        </div>

                    ) : (

                        <div className="rounded-3xl border border-dashed border-stone-300 bg-white px-6 py-12 text-center text-sm text-stone-400">
                            No preparation schedule has been generated yet.
                        </div>

                    )}

                </section>


                {/* RESEARCH */}

                <section className="mt-14">

                    <div className="mb-6">

                        <p className="font-mono text-[10px] uppercase tracking-widest text-amber-600">
                            05 / Research & sources
                        </p>

                        <h2 className="mt-2 font-serif text-3xl tracking-tight text-stone-950 sm:text-4xl">
                            Where this kit came from
                        </h2>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
                            Sources and research used to build the company brief and interview preparation.
                        </p>

                    </div>


                    <div className="grid gap-4 lg:grid-cols-2">

                        {/* COMPANY SOURCES */}

                        <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-7">

                            <div className="flex items-center justify-between gap-4">

                                <p className="font-mono text-[10px] uppercase tracking-widest text-stone-400">
                                    Company research
                                </p>

                                <span className="rounded-full bg-stone-100 px-2.5 py-1 font-mono text-[9px] text-stone-500">
                                    {companySources.length} sources
                                </span>

                            </div>

                            <p className="mt-4 text-sm leading-6 text-stone-500">
                                Research used to build the company brief.
                            </p>

                            {companySources.length > 0 ? (

                                <div className="mt-5 space-y-2">

                                    {companySources.map((url, index) => (

                                        <a
                                            key={`${url}-${index}`}
                                            href={url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="group flex items-start gap-3 rounded-2xl bg-stone-50 px-4 py-3.5 transition hover:bg-stone-100"
                                        >

                                            <span className="mt-0.5 shrink-0 text-amber-600">
                                                ↗
                                            </span>

                                            <span className="min-w-0 break-all text-xs leading-5 text-stone-600 group-hover:text-stone-900">
                                                {url}
                                            </span>

                                        </a>

                                    ))}

                                </div>

                            ) : (

                                <p className="mt-5 text-sm text-stone-400">
                                    No company sources available.
                                </p>

                            )}

                        </div>


                        {/* INTERVIEW RESEARCH */}

                        <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-7">

                            <div className="flex items-center justify-between gap-4">

                                <p className="font-mono text-[10px] uppercase tracking-widest text-stone-400">
                                    Interview research
                                </p>

                                <span className="rounded-full bg-stone-100 px-2.5 py-1 font-mono text-[9px] text-stone-500">
                                    {interviewSourceCount} sources
                                </span>

                            </div>

                            <p className="mt-4 text-sm leading-6 text-stone-500">
                                Research used to shape the interview questions.
                            </p>


                            {Object.keys(interviewResearch).length > 0 ? (

                                <div className="mt-5 space-y-4">

                                    <div className="grid grid-cols-2 gap-3">

                                        <div className="rounded-2xl bg-stone-50 p-4">

                                            <p className="font-mono text-[9px] uppercase tracking-widest text-stone-400">
                                                Searches
                                            </p>

                                            <p className="mt-2 text-2xl font-semibold text-stone-900">
                                                {interviewQueryCount}
                                            </p>

                                        </div>


                                        <div className="rounded-2xl bg-stone-50 p-4">

                                            <p className="font-mono text-[9px] uppercase tracking-widest text-stone-400">
                                                Sources
                                            </p>

                                            <p className="mt-2 text-2xl font-semibold text-stone-900">
                                                {interviewSourceCount}
                                            </p>

                                        </div>

                                    </div>


                                    <div className="rounded-2xl bg-stone-50 p-4">

                                        <p className="font-mono text-[9px] uppercase tracking-widest text-stone-400">
                                            Company
                                        </p>

                                        <p className="mt-2 text-sm font-medium leading-6 text-stone-800">
                                            {interviewResearch.company ||
                                                source.company ||
                                                "Company unavailable"}
                                        </p>

                                    </div>


                                    {interviewSources.length > 0 ? (

                                        <div>

                                            <div className="mb-3 flex items-center justify-between gap-3">

                                                <p className="font-mono text-[9px] uppercase tracking-widest text-stone-400">
                                                    Research sources
                                                </p>

                                                <span className="text-[10px] text-stone-400">
                                                    Open for details
                                                </span>

                                            </div>


                                            <div className="space-y-2">

                                                {interviewSources.map((result, index) =>
                                                {
                                                    const title =
                                                        result.title ||
                                                        `Research source ${index + 1}`;

                                                    const url = result.url || "";

                                                    return (
                                                        <div
                                                            key={`${url}-${index}`}
                                                            className="rounded-2xl bg-stone-50 p-4"
                                                        >

                                                            <div className="flex items-start gap-3">

                                                                <span className="mt-0.5 shrink-0 text-amber-600">
                                                                    ↗
                                                                </span>

                                                                <div className="min-w-0 flex-1">

                                                                    <p className="text-sm font-medium leading-5 text-stone-800">
                                                                        {title}
                                                                    </p>

                                                                    {url && (
                                                                        <a
                                                                            href={url}
                                                                            target="_blank"
                                                                            rel="noreferrer"
                                                                            className="mt-2 block break-all text-[11px] leading-5 text-stone-400 transition hover:text-amber-700"
                                                                        >
                                                                            {url}
                                                                        </a>
                                                                    )}

                                                                </div>

                                                            </div>

                                                        </div>
                                                    );
                                                })}

                                            </div>

                                        </div>

                                    ) : (

                                        <p className="text-sm text-stone-400">
                                            No interview sources available.
                                        </p>

                                    )}

                                </div>

                            ) : (

                                <p className="mt-5 text-sm text-stone-400">
                                    No interview research available.
                                </p>

                            )}

                        </div>

                    </div>


                    {/* CRAWLED PAGES */}

                    {pagesUsed.length > 0 && (

                        <div className="mt-4 rounded-3xl border border-stone-200 bg-white p-6 sm:p-7">

                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                                <p className="font-mono text-[10px] uppercase tracking-widest text-stone-400">
                                    Crawled pages
                                </p>

                                <span className="font-mono text-[9px] uppercase tracking-widest text-stone-400">
                                    {pagesUsed.length} pages
                                </span>

                            </div>

                            <div className="mt-5 grid gap-2">

                                {pagesUsed.map((url, index) => (

                                    <a
                                        key={`${url}-${index}`}
                                        href={url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="group flex items-start gap-3 rounded-2xl bg-stone-50 px-4 py-3.5 transition hover:bg-stone-100"
                                    >

                                        <span className="mt-0.5 shrink-0 text-amber-600">
                                            ↗
                                        </span>

                                        <span className="min-w-0 break-all text-xs leading-5 text-stone-600 group-hover:text-stone-900">
                                            {url}
                                        </span>

                                    </a>

                                ))}

                            </div>

                        </div>

                    )}

                </section>


                {/* COVERAGE */}

                <section className="mt-14 overflow-hidden rounded-3xl bg-stone-950 p-6 text-white sm:p-8">

                    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

                        <div>

                            <p className="font-mono text-[10px] uppercase tracking-widest text-amber-400">
                                06 / Coverage
                            </p>

                            <h2 className="mt-2 font-serif text-2xl sm:text-3xl">
                                Requirement coverage
                            </h2>

                            <p className="mt-2 max-w-xl text-sm leading-6 text-stone-400">
                                How well the generated interview questions cover the extracted requirements.
                            </p>

                        </div>


                        <div className="sm:text-right">

                            <p className="font-serif text-4xl">
                                {coveredPct}%
                            </p>

                            <p className="font-mono text-[9px] uppercase tracking-widest text-stone-500">
                                covered
                            </p>

                        </div>

                    </div>


                    {requirements.length > 0 && (

                        <div className="mt-7">

                            <div className="h-2 w-full overflow-hidden rounded-full bg-stone-800">

                                <div
                                    className="h-full rounded-full bg-amber-400 transition-all"
                                    style={{width: `${coveredPct}%`}}
                                />

                            </div>

                            <div className="mt-3 flex flex-wrap justify-between gap-2 font-mono text-[9px] uppercase tracking-widest text-stone-500">

                                <span>
                                    {requirements.length - uncovered} covered
                                </span>

                                <span>
                                    {uncovered} uncovered
                                </span>

                            </div>

                        </div>

                    )}

                    <div className="mt-6 border-t border-white/10 pt-5">

                        <p className="text-xs text-stone-500">
                            Coverage passes completed:{" "}
                            <span className="text-stone-300">
                                {coverage.passes || 0}
                            </span>
                        </p>

                    </div>

                </section>

            </main>

        </div>
    );
};

export default KitDetails;

