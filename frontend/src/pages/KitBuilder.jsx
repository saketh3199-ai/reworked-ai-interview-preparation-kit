
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    useGetKitQuery,
    useUpdateKitMutation,
    useRegenerateQuestionsMutation
} from "../services/kitApi";

const KitBuilder = () => {
    const { kitId } = useParams();
    const navigate = useNavigate();

    const { data, isLoading, isError } = useGetKitQuery(kitId);

    const [updateKit,{isLoading: isSaving}] = useUpdateKitMutation();

    const [regenerateQuestions,{isLoading: isRegenerating}] =
        useRegenerateQuestionsMutation();

    const [questions,setQuestions] = useState(null);
    const [editedQuestionIds,setEditedQuestionIds] = useState([]);
    const [saveMessage,setSaveMessage] = useState("");
    const [error,setError] = useState("");

    useEffect(() =>
    {
        if (data?.builder?.edited_question_ids)
        {
            setEditedQuestionIds(data.builder.edited_question_ids);
        }
    },[data]);

    if (isLoading)
    {
        return (
            <div className="min-h-screen bg-stone-100 px-6 py-10 sm:px-10 lg:px-14">

                <div className="mx-auto max-w-6xl">

                    <div className="h-8 w-40 animate-pulse rounded bg-stone-200" />

                    <div className="mt-8 h-24 animate-pulse rounded-2xl bg-white" />

                    <div className="mt-4 h-48 animate-pulse rounded-2xl bg-white" />

                    <div className="mt-4 h-48 animate-pulse rounded-2xl bg-white" />

                </div>

            </div>
        );
    }

    if (isError || !data)
    {
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
    const role = kit?.role;

    const currentQuestions = questions || kit?.questions || [];

    const isDirty = questions !== null;

    const handleQuestionChange = (index,field,value) =>
    {
        const updatedQuestions = [...currentQuestions];

        updatedQuestions[index] =
        {
            ...updatedQuestions[index],
            [field]: value
        };

        setQuestions(updatedQuestions);

        setEditedQuestionIds
        (
            (currentIds) =>
            {
                if (currentIds.includes(updatedQuestions[index].id))
                {
                    return currentIds;
                }

                return [
                    ...currentIds,
                    updatedQuestions[index].id
                ];
            }
        );

        setSaveMessage("");
        setError("");
    };

    const getNextQuestionId = () =>
    {
        const numbers = currentQuestions
            .map((question) => Number(question.id?.replace("q","")))
            .filter((number) => Number.isInteger(number));

        const nextNumber = numbers.length > 0
            ? Math.max(...numbers) + 1
            : 1;

        return `q${nextNumber}`;
    };

    const handleAddQuestion = () =>
    {
        const newQuestion =
        {
            id: getNextQuestionId(),
            requirement_ids: [],
            category: "technical",
            prompt: "",
            answer_outline: "",
            difficulty: 1
        };

        setQuestions
        (
            [
                ...currentQuestions,
                newQuestion
            ]
        );

        setEditedQuestionIds
        (
            (currentIds) =>
            {
                if (currentIds.includes(newQuestion.id))
                {
                    return currentIds;
                }

                return [
                    ...currentIds,
                    newQuestion.id
                ];
            }
        );

        setSaveMessage("");
        setError("");
    };

    const handleDeleteQuestion = (index) =>
    {
        const deletedQuestionId = currentQuestions[index]?.id;

        const updatedQuestions = currentQuestions.filter
        (
            (_,questionIndex) => questionIndex !== index
        );

        setQuestions(updatedQuestions);

        setEditedQuestionIds
        (
            (currentIds) =>
                currentIds.filter
                (
                    (id) => id !== deletedQuestionId
                )
        );

        setSaveMessage("");
        setError("");
    };

    const handleMoveQuestion = (index,direction) =>
    {
        const newIndex = index + direction;

        if (newIndex < 0 || newIndex >= currentQuestions.length)
        {
            return;
        }

        const updatedQuestions = [...currentQuestions];

        const [movedQuestion] = updatedQuestions.splice(index,1);

        updatedQuestions.splice(newIndex,0,movedQuestion);

        setQuestions(updatedQuestions);

        setSaveMessage("");
        setError("");
    };

    const handleDiscard = () =>
    {
        setQuestions(null);

        setEditedQuestionIds
        (
            data.builder?.edited_question_ids || []
        );

        setSaveMessage("");
        setError("");
    };

    const handleRegenerate = async () =>
    {
        setError("");
        setSaveMessage("");

        try
        {
            await regenerateQuestions(kitId).unwrap();

            setQuestions(null);

            setSaveMessage(
                "Questions regenerated successfully. Your edited questions were preserved."
            );
        }
        catch (error)
        {
            setError
            (
                error?.data?.message ||
                "Unable to regenerate questions."
            );
        }
    };

    const handleSave = async () =>
    {
        setError("");
        setSaveMessage("");

        try
        {
            await updateKit
            (
                {
                    kitId,

                    kitData:
                    {
                        questions: currentQuestions,

                        builder:
                        {
                            edited_question_ids: editedQuestionIds
                        }
                    }
                }
            ).unwrap();

            setQuestions(null);

            setSaveMessage("Changes saved successfully.");
        }
        catch (error)
        {
            setError
            (
                error?.data?.message ||
                "Unable to save changes."
            );
        }
    };

    return (
        <div className="min-h-screen bg-stone-100">

            <header className="sticky top-0 z-10 border-b border-stone-200 bg-stone-100/90 backdrop-blur">

                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 sm:px-10 lg:px-14">

                    <button
                        onClick={() => navigate(`/kit/${kitId}`)}
                        className="font-mono text-xs uppercase tracking-wide text-stone-500 transition-colors hover:text-stone-900"
                    >
                        ← Back to kit
                    </button>

                    <div className="flex items-center gap-3">

                        {isDirty && !isSaving && !isRegenerating && (
                            <>
                                <span className="hidden font-mono text-[10px] uppercase tracking-wide text-amber-600 sm:inline">
                                    Unsaved changes
                                </span>

                                <button
                                    onClick={handleDiscard}
                                    className="font-mono text-xs uppercase tracking-wide text-stone-400 transition-colors hover:text-stone-700"
                                >
                                    Discard
                                </button>
                            </>
                        )}

                        <button
                            onClick={handleRegenerate}
                            disabled={isRegenerating || isSaving || isDirty}
                            title={
                                isDirty
                                    ? "Save your changes before regenerating"
                                    : "Generate fresh questions while preserving your edited questions"
                            }
                            className="rounded-full border border-stone-300 bg-white px-5 py-2.5 text-sm font-medium text-stone-700 transition-colors hover:border-stone-400 hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isRegenerating
                                ? "Regenerating..."
                                : "Regenerate questions"
                            }
                        </button>

                        <button
                            onClick={handleSave}
                            disabled={isSaving || isRegenerating || !isDirty}
                            className="rounded-full bg-stone-950 px-5 py-2.5 text-sm font-medium text-stone-50 transition-colors hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isSaving
                                ? "Saving..."
                                : "Save changes"
                            }
                        </button>

                    </div>

                </div>

            </header>

            <main className="mx-auto max-w-6xl px-6 py-10 sm:px-10 lg:px-14 lg:py-14">

                <section>

                    <p className="font-mono text-xs uppercase tracking-widest text-stone-500">
                        Kit builder
                    </p>

                    <h1 className="mt-3 font-serif text-4xl text-stone-900 sm:text-5xl">
                        Edit your preparation.
                    </h1>

                    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-stone-500 sm:text-base">
                        Edit your interview questions before you start preparing.
                        Your changes are saved to this preparation kit.
                    </p>

                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-400">
                        You can regenerate the question bank later while keeping
                        questions you have personally edited.
                    </p>

                    {saveMessage && (
                        <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
                            {saveMessage}
                        </div>
                    )}

                    {error && (
                        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                </section>

                <section className="mt-12">

                    <div className="mb-5 flex items-end justify-between">

                        <div>

                            <p className="font-mono text-[11px] uppercase tracking-wide text-stone-400">
                                Question bank
                            </p>

                            <h2 className="mt-2 font-serif text-3xl text-stone-900">
                                {role?.title || "Interview questions"}
                            </h2>

                        </div>

                        <div className="flex items-center gap-3">

                            <span className="hidden font-mono text-xs text-stone-400 sm:inline">
                                {currentQuestions.length} questions
                            </span>

                            <button
                                onClick={handleAddQuestion}
                                disabled={isRegenerating}
                                className="rounded-full bg-stone-950 px-4 py-2 font-mono text-[10px] uppercase tracking-wide text-stone-50 transition-colors hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                + Add question
                            </button>

                        </div>

                    </div>

                    {currentQuestions.length > 0 ? (

                        <div className="space-y-4">

                            {currentQuestions.map((question,index) => (

                                <div
                                    key={question.id}
                                    className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-7"
                                >

                                    <div className="flex items-center justify-between gap-4">

                                        <span className="font-mono text-xs text-stone-300">
                                            {String(index + 1).padStart(2,"0")}
                                        </span>

                                        <div className="flex items-center gap-2">

                                            <button
                                                onClick={() => handleMoveQuestion(index,-1)}
                                                disabled={
                                                    index === 0 ||
                                                    isRegenerating
                                                }
                                                className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-500 transition-colors hover:bg-stone-200 disabled:cursor-not-allowed disabled:opacity-30"
                                                title="Move up"
                                            >
                                                ↑
                                            </button>

                                            <button
                                                onClick={() => handleMoveQuestion(index,1)}
                                                disabled={
                                                    index === currentQuestions.length - 1 ||
                                                    isRegenerating
                                                }
                                                className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-500 transition-colors hover:bg-stone-200 disabled:cursor-not-allowed disabled:opacity-30"
                                                title="Move down"
                                            >
                                                ↓
                                            </button>

                                            <button
                                                onClick={() => handleDeleteQuestion(index)}
                                                disabled={isRegenerating}
                                                className="ml-1 rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide text-red-500 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                Delete
                                            </button>

                                            <span className="rounded-full bg-amber-100 px-2.5 py-1 font-mono text-[10px] uppercase text-amber-700">
                                                {question.category}
                                            </span>

                                        </div>

                                    </div>

                                    <div className="mt-6">

                                        <label
                                            htmlFor={`prompt-${question.id}`}
                                            className="font-mono text-[10px] uppercase tracking-wide text-stone-400"
                                        >
                                            Question
                                        </label>

                                        <textarea
                                            id={`prompt-${question.id}`}
                                            value={question.prompt}
                                            disabled={isRegenerating}
                                            onChange={(event) =>
                                                handleQuestionChange(
                                                    index,
                                                    "prompt",
                                                    event.target.value
                                                )
                                            }
                                            rows={3}
                                            className="mt-2 w-full resize-y rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm leading-relaxed text-stone-900 outline-none transition-colors focus:border-stone-900 disabled:cursor-not-allowed disabled:opacity-60"
                                        />

                                    </div>

                                    <div className="mt-5">

                                        <label
                                            htmlFor={`answer-${question.id}`}
                                            className="font-mono text-[10px] uppercase tracking-wide text-stone-400"
                                        >
                                            Answer outline
                                        </label>

                                        <textarea
                                            id={`answer-${question.id}`}
                                            value={question.answer_outline}
                                            disabled={isRegenerating}
                                            onChange={(event) =>
                                                handleQuestionChange(
                                                    index,
                                                    "answer_outline",
                                                    event.target.value
                                                )
                                            }
                                            rows={4}
                                            className="mt-2 w-full resize-y rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm leading-relaxed text-stone-600 outline-none transition-colors focus:border-stone-900 disabled:cursor-not-allowed disabled:opacity-60"
                                        />

                                    </div>

                                    <div className="mt-5 flex flex-wrap items-center gap-3">

                                        {question.requirement_ids?.length > 0 && (

                                            <span className="rounded-full bg-stone-100 px-3 py-1.5 font-mono text-[10px] text-stone-500">
                                                {question.requirement_ids.join(", ")}
                                            </span>

                                        )}

                                        <span className="rounded-full bg-stone-100 px-3 py-1.5 font-mono text-[10px] text-stone-500">
                                            Difficulty {question.difficulty}
                                        </span>

                                    </div>

                                </div>

                            ))}

                        </div>

                    ) : (

                        <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">

                            <p className="font-serif text-xl text-stone-800">
                                No questions to edit yet.
                            </p>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-stone-500">
                                This kit doesn't have any generated questions.
                                Add questions or regenerate the question bank.
                            </p>

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
};

export default KitBuilder;

