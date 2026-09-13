
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
    useGetKitQuery,
    useUpdatePracticeMutation
} from "../services/kitApi";


const Practice = () =>
{
    const { kitId } = useParams();
    const navigate = useNavigate();

    const { data: kit,isLoading,isError } = useGetKitQuery(kitId);

    const [updatePractice,{isLoading: isSaving}] = useUpdatePracticeMutation();

    const [currentIndex,setCurrentIndex] = useState(0);
    const [revealed,setRevealed] = useState(false);
    const [confidence,setConfidence] = useState({});
    const [practiceOrder,setPracticeOrder] = useState([]);
    const [saveError,setSaveError] = useState("");


    useEffect(() =>
    {
        if (kit?.practice?.confidence)
        {
            setConfidence
            (
                Object.fromEntries
                (
                    Object.entries(kit.practice.confidence)
                )
            );
        }
    },[kit]);


    if (isLoading)
    {
        return (
            <div className="min-h-screen bg-stone-50 px-6 py-10">

                <div className="mx-auto max-w-4xl">

                    <div className="h-4 w-24 animate-pulse rounded bg-stone-200" />

                    <div className="mt-4 h-10 w-2/3 animate-pulse rounded bg-stone-200" />

                    <div className="mt-8 h-64 animate-pulse rounded-3xl bg-white" />

                </div>

            </div>
        );
    }


    if (isError || !kit)
    {
        return (
            <div className="flex min-h-screen items-center justify-center bg-stone-50 px-6">

                <div className="text-center">

                    <p className="font-semibold text-stone-950">
                        Unable to load practice kit.
                    </p>

                    <p className="mt-2 text-sm text-stone-500">
                        It may have been removed, or there's a connection issue.
                    </p>

                    <button
                        onClick={() => navigate("/dashboard")}
                        className="mt-5 rounded-full bg-stone-950 px-5 py-3 text-sm text-white transition-colors hover:bg-stone-800"
                    >
                        Back to dashboard
                    </button>

                </div>

            </div>
        );
    }


    const flashcards = kit.kit?.flashcards || [];

    const total = flashcards.length;


    const currentOrder = practiceOrder.length > 0
        ? practiceOrder
        : flashcards.map((flashcard) => flashcard.id);


    const currentCardId = currentOrder[currentIndex];

    const card = flashcards.find
    (
        (flashcard) => flashcard.id === currentCardId
    );


    const progressPct = total > 0
        ? Math.round(((currentIndex + 1) / total) * 100)
        : 0;


    const isLastCard = currentIndex === total - 1;

    const isDone = total > 0 && currentIndex >= total;


    const goToCard = (index) =>
    {
        setCurrentIndex(index);
        setRevealed(false);
    };


    const handleNext = () =>
    {
        if (isLastCard)
        {
            setCurrentIndex(total);
        }
        else
        {
            goToCard(currentIndex + 1);
        }
    };


    const handleConfidence = async (level) =>
    {
        if (!card || isSaving)
        {
            return;
        }

        const updatedConfidence =
        {
            ...confidence,
            [card.id]: level
        };

        setConfidence(updatedConfidence);
        setSaveError("");

        try
        {
            await updatePractice
            (
                {
                    kitId,
                    confidence: updatedConfidence
                }
            ).unwrap();

            handleNext();
        }
        catch (error)
        {
            console.error("Practice save error:",error);

            setSaveError
            (
                error?.data?.message ||
                "Unable to save your confidence level."
            );
        }
    };


    const handleRestart = () =>
    {
        const confidenceRank =
        {
            low: 1,
            medium: 2,
            high: 3
        };


        const sortedFlashcards = [...flashcards].sort
        (
            (first,second) =>
            {
                const firstConfidence =
                    confidenceRank[confidence[first.id]] || 4;

                const secondConfidence =
                    confidenceRank[confidence[second.id]] || 4;

                return firstConfidence - secondConfidence;
            }
        );


        setPracticeOrder
        (
            sortedFlashcards.map((flashcard) => flashcard.id)
        );

        setCurrentIndex(0);
        setRevealed(false);
        setSaveError("");
    };


    const lowConfidenceCount = Object.values(confidence)
        .filter((level) => level === "low")
        .length;


    const mediumConfidenceCount = Object.values(confidence)
        .filter((level) => level === "medium")
        .length;


    const highConfidenceCount = Object.values(confidence)
        .filter((level) => level === "high")
        .length;


    return (
        <div className="min-h-screen bg-stone-50 px-6 py-10">

            <div className="mx-auto max-w-4xl">

                <div className="flex items-start justify-between gap-4">

                    <div>

                        <p className="text-sm font-medium uppercase tracking-wider text-amber-700">
                            Practice Mode
                        </p>

                        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
                            Strengthen your weak areas
                        </h1>

                        <p className="mt-3 text-stone-600">
                            Practice one flashcard at a time and build confidence as you go.
                        </p>

                    </div>


                    <button
                        onClick={() => navigate(`/kit/${kitId}`)}
                        className="hidden flex-shrink-0 text-sm font-medium text-stone-500 transition-colors hover:text-stone-900 sm:block"
                    >
                        ← Back to kit
                    </button>

                </div>


                {total === 0 ? (

                    <div className="mt-10 rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">

                        <p className="text-stone-600">
                            No flashcards are available for this kit.
                        </p>

                    </div>

                ) : isDone ? (

                    <div className="mt-10 rounded-3xl border border-stone-200 bg-white p-8 text-center shadow-sm sm:p-10">

                        <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                            Session complete
                        </p>

                        <h2 className="mt-4 text-2xl font-semibold text-stone-950 sm:text-3xl">
                            You reviewed all {total} flashcards.
                        </h2>

                        <p className="mt-3 text-stone-600">
                            Your confidence breakdown is below.
                        </p>


                        <div className="mx-auto mt-8 grid max-w-xl gap-3 sm:grid-cols-3">

                            <div className="rounded-2xl border border-red-100 bg-red-50 p-4">

                                <p className="text-2xl font-semibold text-red-700">
                                    {lowConfidenceCount}
                                </p>

                                <p className="mt-1 text-sm text-red-700">
                                    Low confidence
                                </p>

                            </div>


                            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">

                                <p className="text-2xl font-semibold text-amber-700">
                                    {mediumConfidenceCount}
                                </p>

                                <p className="mt-1 text-sm text-amber-700">
                                    Medium confidence
                                </p>

                            </div>


                            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">

                                <p className="text-2xl font-semibold text-emerald-700">
                                    {highConfidenceCount}
                                </p>

                                <p className="mt-1 text-sm text-emerald-700">
                                    High confidence
                                </p>

                            </div>

                        </div>


                        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

                            <button
                                onClick={handleRestart}
                                className="rounded-full bg-stone-950 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-stone-800"
                            >
                                Practice again
                            </button>

                            <button
                                onClick={() => navigate(`/kit/${kitId}`)}
                                className="rounded-full border border-stone-300 px-6 py-3 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-100"
                            >
                                Back to kit
                            </button>

                        </div>

                    </div>

                ) : (

                    <div className="mt-10">

                        <div className="mb-2 flex items-center justify-between">

                            <p className="text-sm font-medium text-stone-500">
                                Flashcard {currentIndex + 1} of {total}
                            </p>

                            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                                {Object.keys(confidence).length} reviewed
                            </span>

                        </div>


                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-200">

                            <div
                                className="h-full rounded-full bg-amber-500 transition-all"
                                style={{width: `${progressPct}%`}}
                            />

                        </div>


                        {saveError && (

                            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {saveError}
                            </div>

                        )}


                        <div className="mt-6 rounded-3xl border border-stone-200 bg-white p-8 shadow-sm sm:p-10">

                            <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                                Question
                            </p>


                            <h2 className="mt-5 min-h-[3.5rem] text-2xl font-semibold leading-tight text-stone-950 sm:text-3xl">
                                {card?.front}
                            </h2>


                            {revealed && (

                                <div className="mt-6 border-t border-stone-100 pt-6">

                                    <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                                        Answer
                                    </p>

                                    <p className="mt-3 leading-relaxed text-stone-700">
                                        {card?.back}
                                    </p>

                                </div>

                            )}


                            <div className="mt-10">

                                {!revealed ? (

                                    <button
                                        onClick={() => setRevealed(true)}
                                        className="rounded-full border border-amber-300 bg-amber-50 px-6 py-3 text-sm font-medium text-amber-800 transition-colors hover:bg-amber-100"
                                    >
                                        Reveal answer
                                    </button>

                                ) : (

                                    <div>

                                        <p className="mb-4 text-sm font-medium text-stone-600">
                                            How confident are you with this?
                                        </p>


                                        <div className="flex flex-wrap gap-3">

                                            <button
                                                disabled={isSaving}
                                                onClick={() => handleConfidence("low")}
                                                className="rounded-full border border-red-200 bg-red-50 px-5 py-3 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                Low confidence
                                            </button>


                                            <button
                                                disabled={isSaving}
                                                onClick={() => handleConfidence("medium")}
                                                className="rounded-full border border-amber-200 bg-amber-50 px-5 py-3 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                Medium confidence
                                            </button>


                                            <button
                                                disabled={isSaving}
                                                onClick={() => handleConfidence("high")}
                                                className="rounded-full border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {isSaving ? "Saving..." : "High confidence"}
                                            </button>

                                        </div>

                                    </div>

                                )}

                            </div>

                        </div>


                        {currentIndex > 0 && (

                            <button
                                onClick={() => goToCard(currentIndex - 1)}
                                className="mt-4 text-sm font-medium text-stone-500 transition-colors hover:text-stone-900"
                            >
                                ← Previous card
                            </button>

                        )}

                    </div>

                )}

            </div>

        </div>
    );
};


export default Practice;

