import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import
{
    useGetKitQuery,
    useUpdateKitMutation,
    useRegenerateQuestionsMutation
}
from "../services/kitApi";

const KitBuilder = () =>
{
    const { kitId } = useParams();
    const navigate = useNavigate();

    const
    {
        data,
        isLoading,
        isError,
        refetch
    } = useGetKitQuery(kitId);

    const [updateKit, { isLoading: isSaving }] =
        useUpdateKitMutation();

    const [regenerateQuestions, { isLoading: isRegenerating }] =
        useRegenerateQuestionsMutation();

    const [questions, setQuestions] = useState(null);
    const [role, setRole] = useState(null);
    const [responsibilities, setResponsibilities] = useState(null);
    const [requirements, setRequirements] = useState(null);
    const [flashcards, setFlashcards] = useState(null);

    const [editedQuestionIds, setEditedQuestionIds] = useState([]);

    const [saveMessage, setSaveMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const kit = data?.kit;

    const currentRole = role || kit?.role || {};
    const currentResponsibilities =
        responsibilities ||
        currentRole.responsibilities ||
        [];

    const currentRequirements =
        requirements ||
        currentRole.requirements ||
        [];

    const currentQuestions =
        questions ||
        kit?.questions ||
        [];

    const currentFlashcards =
        flashcards ||
        kit?.flashcards ||
        [];

    const isDirty =
        questions !== null ||
        role !== null ||
        responsibilities !== null ||
        requirements !== null ||
        flashcards !== null;

    const isBusy =
        isSaving ||
        isRegenerating;

    useEffect(() =>
    {
        if (data?.builder?.edited_question_ids)
        {
            setEditedQuestionIds(
                data.builder.edited_question_ids
            );
        }
    }, [data]);

    const markDirty = () =>
    {
        setSaveMessage("");
        setErrorMessage("");
    };

    const handleRoleChange = (field, value) =>
    {
        setRole((current) =>
        {
            const baseRole =
                current ||
                kit?.role ||
                {};

            return {
                ...baseRole,
                [field]: value
            };
        });

        markDirty();
    };

    const handleResponsibilityChange = (index, value) =>
    {
        setResponsibilities((current) =>
        {
            const nextResponsibilities =
                [
                    ...(current ||
                        kit?.role?.responsibilities ||
                        [])
                ];

            nextResponsibilities[index] = value;

            return nextResponsibilities;
        });

        markDirty();
    };

    const handleAddResponsibility = () =>
    {
        setResponsibilities((current) =>
        {
            return [
                ...(current ||
                    kit?.role?.responsibilities ||
                    []),
                ""
            ];
        });

        markDirty();
    };

    const handleDeleteResponsibility = (index) =>
    {
        const confirmed = window.confirm(
            "Delete this responsibility?"
        );

        if (!confirmed)
        {
            return;
        }

        setResponsibilities((current) =>
        {
            const nextResponsibilities =
                [
                    ...(current ||
                        kit?.role?.responsibilities ||
                        [])
                ];

            nextResponsibilities.splice(index, 1);

            return nextResponsibilities;
        });

        markDirty();
    };

    const handleMoveResponsibility = (index, direction) =>
    {
        const nextIndex =
            direction === "up"
                ? index - 1
                : index + 1;

        if (
            nextIndex < 0 ||
            nextIndex >= currentResponsibilities.length
        )
        {
            return;
        }

        setResponsibilities((current) =>
        {
            const nextResponsibilities =
                [
                    ...(current ||
                        kit?.role?.responsibilities ||
                        [])
                ];

            const currentResponsibility =
                nextResponsibilities[index];

            nextResponsibilities[index] =
                nextResponsibilities[nextIndex];

            nextResponsibilities[nextIndex] =
                currentResponsibility;

            return nextResponsibilities;
        });

        markDirty();
    };

    const getNextRequirementId = () =>
    {
        const usedNumbers =
            currentRequirements.map(
                (requirement) =>
                {
                    const match =
                        String(requirement.id || "")
                            .match(/^r(\d+)$/);

                    return match
                        ? Number(match[1])
                        : 0;
                }
            );

        let nextNumber =
            Math.max(0, ...usedNumbers) + 1;

        while (
            currentRequirements.some(
                (requirement) =>
                    requirement.id === `r${nextNumber}`
            )
        )
        {
            nextNumber++;
        }

        return `r${nextNumber}`;
    };

    const handleRequirementChange =
        (index, field, value) =>
    {
        setRequirements((current) =>
        {
            const nextRequirements =
                [
                    ...(current ||
                        kit?.role?.requirements ||
                        [])
                ];

            nextRequirements[index] =
            {
                ...nextRequirements[index],
                [field]: value
            };

            return nextRequirements;
        });

        markDirty();
    };

    const handleAddRequirement = () =>
    {
        const newRequirement =
        {
            id: getNextRequirementId(),
            text: "",
            kind: "technical",
            priority: "must"
        };

        setRequirements((current) =>
        {
            return [
                ...(current ||
                    kit?.role?.requirements ||
                    []),
                newRequirement
            ];
        });

        markDirty();
    };

    const handleDeleteRequirement = (index) =>
    {
        const requirementToDelete =
            currentRequirements[index];

        const confirmed = window.confirm(
            "Delete this requirement? Any questions or flashcards linked to it will no longer reference it."
        );

        if (!confirmed)
        {
            return;
        }

        setRequirements((current) =>
        {
            const nextRequirements =
                [
                    ...(current ||
                        kit?.role?.requirements ||
                        [])
                ];

            nextRequirements.splice(index, 1);

            return nextRequirements;
        });

        if (requirementToDelete?.id)
        {
            setQuestions((current) =>
            {
                const baseQuestions =
                    current ||
                    kit?.questions ||
                    [];

                return baseQuestions.map(
                    (question) =>
                    ({
                        ...question,
                        requirement_ids:
                            (
                                question.requirement_ids ||
                                []
                            ).filter(
                                (id) =>
                                    id !== requirementToDelete.id
                            )
                    })
                );
            });

            setFlashcards((current) =>
            {
                const baseFlashcards =
                    current ||
                    kit?.flashcards ||
                    [];

                return baseFlashcards.map(
                    (flashcard) =>
                    ({
                        ...flashcard,
                        requirement_ids:
                            (
                                flashcard.requirement_ids ||
                                []
                            ).filter(
                                (id) =>
                                    id !== requirementToDelete.id
                            )
                    })
                );
            });
        }

        markDirty();
    };

    const handleMoveRequirement =
        (index, direction) =>
    {
        const nextIndex =
            direction === "up"
                ? index - 1
                : index + 1;

        if (
            nextIndex < 0 ||
            nextIndex >= currentRequirements.length
        )
        {
            return;
        }

        setRequirements((current) =>
        {
            const nextRequirements =
                [
                    ...(current ||
                        kit?.role?.requirements ||
                        [])
                ];

            const currentRequirement =
                nextRequirements[index];

            nextRequirements[index] =
                nextRequirements[nextIndex];

            nextRequirements[nextIndex] =
                currentRequirement;

            return nextRequirements;
        });

        markDirty();
    };

    const handleQuestionChange =
        (index, field, value) =>
    {
        setQuestions((current) =>
        {
            const nextQuestions =
                [
                    ...(current ||
                        kit?.questions ||
                        [])
                ];

            nextQuestions[index] =
            {
                ...nextQuestions[index],
                [field]: value
            };

            return nextQuestions;
        });

        const questionId =
            currentQuestions[index]?.id;

        if (questionId)
        {
            setEditedQuestionIds((current) =>
            {
                if (current.includes(questionId))
                {
                    return current;
                }

                return [
                    ...current,
                    questionId
                ];
            });
        }

        markDirty();
    };

    const handleRequirementToggle =
        (index, requirementId) =>
    {
        const question =
            currentQuestions[index];

        if (!question)
        {
            return;
        }

        const currentRequirementIds =
            question.requirement_ids ||
            [];

        const nextRequirementIds =
            currentRequirementIds.includes(
                requirementId
            )
                ? currentRequirementIds.filter(
                    (id) =>
                        id !== requirementId
                )
                : [
                    ...currentRequirementIds,
                    requirementId
                ];

        handleQuestionChange(
            index,
            "requirement_ids",
            nextRequirementIds
        );
    };

    const getNextQuestionId = () =>
    {
        const usedNumbers =
            currentQuestions.map(
                (question) =>
                {
                    const match =
                        String(question.id || "")
                            .match(/^q(\d+)$/);

                    return match
                        ? Number(match[1])
                        : 0;
                }
            );

        let nextNumber =
            Math.max(0, ...usedNumbers) + 1;

        while (
            currentQuestions.some(
                (question) =>
                    question.id === `q${nextNumber}`
            )
        )
        {
            nextNumber++;
        }

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

        setQuestions((current) =>
        {
            return [
                ...(current ||
                    kit?.questions ||
                    []),
                newQuestion
            ];
        });

        setEditedQuestionIds((current) =>
        {
            return [
                ...current,
                newQuestion.id
            ];
        });

        markDirty();
    };

    const handleDeleteQuestion = (index) =>
    {
        const confirmed = window.confirm(
            "Delete this interview question?"
        );

        if (!confirmed)
        {
            return;
        }

        setQuestions((current) =>
        {
            const nextQuestions =
                [
                    ...(current ||
                        kit?.questions ||
                        [])
                ];

            const deletedQuestion =
                nextQuestions[index];

            nextQuestions.splice(index, 1);

            if (deletedQuestion)
            {
                setEditedQuestionIds(
                    (currentEditedIds) =>
                    {
                        return currentEditedIds.filter(
                            (id) =>
                                id !== deletedQuestion.id
                        );
                    }
                );
            }

            return nextQuestions;
        });

        markDirty();
    };

    const handleMoveQuestion =
        (index, direction) =>
    {
        const nextIndex =
            direction === "up"
                ? index - 1
                : index + 1;

        if (
            nextIndex < 0 ||
            nextIndex >= currentQuestions.length
        )
        {
            return;
        }

        setQuestions((current) =>
        {
            const nextQuestions =
                [
                    ...(current ||
                        kit?.questions ||
                        [])
                ];

            const currentQuestion =
                nextQuestions[index];

            nextQuestions[index] =
                nextQuestions[nextIndex];

            nextQuestions[nextIndex] =
                currentQuestion;

            return nextQuestions;
        });

        markDirty();
    };

    const getNextFlashcardId = () =>
    {
        const usedNumbers =
            currentFlashcards.map(
                (flashcard) =>
                {
                    const match =
                        String(flashcard.id || "")
                            .match(/^f(\d+)$/);

                    return match
                        ? Number(match[1])
                        : 0;
                }
            );

        let nextNumber =
            Math.max(0, ...usedNumbers) + 1;

        while (
            currentFlashcards.some(
                (flashcard) =>
                    flashcard.id === `f${nextNumber}`
            )
        )
        {
            nextNumber++;
        }

        return `f${nextNumber}`;
    };

    const handleFlashcardChange =
        (index, field, value) =>
    {
        setFlashcards((current) =>
        {
            const nextFlashcards =
                [
                    ...(current ||
                        kit?.flashcards ||
                        [])
                ];

            nextFlashcards[index] =
            {
                ...nextFlashcards[index],
                [field]: value
            };

            return nextFlashcards;
        });

        markDirty();
    };

    const handleFlashcardRequirementToggle =
        (index, requirementId) =>
    {
        const flashcard =
            currentFlashcards[index];

        if (!flashcard)
        {
            return;
        }

        const currentRequirementIds =
            flashcard.requirement_ids ||
            [];

        const nextRequirementIds =
            currentRequirementIds.includes(
                requirementId
            )
                ? currentRequirementIds.filter(
                    (id) =>
                        id !== requirementId
                )
                : [
                    ...currentRequirementIds,
                    requirementId
                ];

        handleFlashcardChange(
            index,
            "requirement_ids",
            nextRequirementIds
        );
    };

    const handleAddFlashcard = () =>
    {
        const newFlashcard =
        {
            id: getNextFlashcardId(),
            front: "",
            back: "",
            requirement_ids: []
        };

        setFlashcards((current) =>
        {
            return [
                ...(current ||
                    kit?.flashcards ||
                    []),
                newFlashcard
            ];
        });

        markDirty();
    };

    const handleDeleteFlashcard = (index) =>
    {
        const confirmed = window.confirm(
            "Delete this flashcard?"
        );

        if (!confirmed)
        {
            return;
        }

        setFlashcards((current) =>
        {
            const nextFlashcards =
                [
                    ...(current ||
                        kit?.flashcards ||
                        [])
                ];

            nextFlashcards.splice(index, 1);

            return nextFlashcards;
        });

        markDirty();
    };

    const handleDiscard = () =>
    {
        if (!isDirty)
        {
            return;
        }

        const confirmed = window.confirm(
            "Discard all unsaved changes?"
        );

        if (!confirmed)
        {
            return;
        }

        setRole(null);
        setResponsibilities(null);
        setRequirements(null);
        setQuestions(null);
        setFlashcards(null);

        setEditedQuestionIds(
            data?.builder?.edited_question_ids ||
            []
        );

        setSaveMessage(
            "Changes discarded."
        );

        setErrorMessage("");
    };

    const handleSave = async () =>
    {
        const invalidQuestion =
            currentQuestions.find(
                (question) =>
                    !question.prompt?.trim() ||
                    !question.answer_outline?.trim()
            );

        if (invalidQuestion)
        {
            setErrorMessage(
                "Every question must have a prompt and answer outline."
            );

            setSaveMessage("");
            return;
        }

        const invalidRequirement =
            currentRequirements.find(
                (requirement) =>
                    !requirement.text?.trim()
            );

        if (invalidRequirement)
        {
            setErrorMessage(
                "Every requirement must have requirement text."
            );

            setSaveMessage("");
            return;
        }

        const invalidResponsibility =
            currentResponsibilities.find(
                (responsibility) =>
                    !responsibility?.trim()
            );

        if (invalidResponsibility)
        {
            setErrorMessage(
                "Every responsibility must contain text."
            );

            setSaveMessage("");
            return;
        }

        const invalidFlashcard =
            currentFlashcards.find(
                (flashcard) =>
                    !flashcard.front?.trim() ||
                    !flashcard.back?.trim()
            );

        if (invalidFlashcard)
        {
            setErrorMessage(
                "Every flashcard must have front and back content."
            );

            setSaveMessage("");
            return;
        }

        try
        {
            await updateKit(
                {
                    kitId,
                    kitData:
                    {
                        role:
                        {
                            ...currentRole,
                            responsibilities:
                                currentResponsibilities,
                            requirements:
                                currentRequirements
                        },
                        questions:
                            currentQuestions,
                        flashcards:
                            currentFlashcards,
                        builder:
                        {
                            edited_question_ids:
                                editedQuestionIds
                        }
                    }
                }
            ).unwrap();

            setRole(null);
            setResponsibilities(null);
            setRequirements(null);
            setQuestions(null);
            setFlashcards(null);

            setSaveMessage(
                "Changes saved successfully."
            );

            setErrorMessage("");
        }
        catch (error)
        {
            console.error(
                "Save Kit Builder error:",
                error
            );

            setErrorMessage(
                error?.data?.message ||
                "Unable to save your changes."
            );

            setSaveMessage("");
        }
    };

    const handleRegenerate = async () =>
    {
        if (isDirty)
        {
            setErrorMessage(
                "Save or discard your changes before regenerating questions."
            );

            setSaveMessage("");
            return;
        }

        try
        {
            await regenerateQuestions(
                kitId
            ).unwrap();

            setQuestions(null);

            setSaveMessage(
                "Questions regenerated successfully. Your edited questions were preserved."
            );

            setErrorMessage("");
        }
        catch (error)
        {
            console.error(
                "Regenerate questions error:",
                error
            );

            setErrorMessage(
                error?.data?.message ||
                "Unable to regenerate questions."
            );

            setSaveMessage("");
        }
    };

    if (isLoading)
    {
        return (
            <div className="min-h-screen bg-gray-50 px-4 py-8 sm:py-10">

                <div className="mx-auto max-w-6xl">

                    <div className="animate-pulse">

                        <div className="h-40 rounded-xl bg-white" />

                        <div className="mt-6 h-48 rounded-xl bg-white" />

                        <div className="mt-6 h-80 rounded-xl bg-white" />

                        <div className="mt-6 h-80 rounded-xl bg-white" />

                    </div>

                    <p className="mt-5 text-center text-sm text-gray-500">
                        Loading your preparation builder...
                    </p>

                </div>

            </div>
        );
    }

    if (isError || !data)
    {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">

                <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-sm">

                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                        !
                    </div>

                    <p className="mt-4 text-lg font-semibold text-gray-900">
                        Unable to load this preparation kit.
                    </p>

                    <p className="mt-2 text-sm leading-relaxed text-gray-500">
                        The kit may have been removed, or there may be a connection issue.
                    </p>

                    <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">

                        <button
                            onClick={() => refetch()}
                            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                        >
                            Try again
                        </button>

                        <button
                            onClick={() => navigate("/dashboard")}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                        >
                            Back to dashboard
                        </button>

                    </div>

                </div>

            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8">

            <div className="mx-auto max-w-6xl">

                {/* HEADER */}

                <div className="mb-8 flex flex-col gap-5 rounded-xl bg-white p-5 shadow-sm sm:p-6 lg:flex-row lg:items-center lg:justify-between">

                    <div className="min-w-0">

                        <button
                            onClick={() => navigate(`/kit/${kitId}`)}
                            disabled={isBusy}
                            className="mb-3 text-sm text-gray-600 transition-colors hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            ← Back to kit
                        </button>

                        <div className="flex flex-wrap items-center gap-2">

                            <h1 className="text-2xl font-bold text-gray-900">
                                Edit your preparation
                            </h1>

                            {isDirty && (
                                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                                    Unsaved changes
                                </span>
                            )}

                            {!isDirty && !isBusy && (
                                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                    Saved
                                </span>
                            )}

                        </div>

                        <p className="mt-1 text-sm text-gray-600">
                            Customize your role, requirements, questions and flashcards.
                        </p>

                    </div>

                    <div className="flex flex-wrap gap-2">

                        <button
                            onClick={handleDiscard}
                            disabled={
                                !isDirty ||
                                isBusy
                            }
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Discard
                        </button>

                        <button
                            onClick={handleRegenerate}
                            disabled={
                                isDirty ||
                                isBusy
                            }
                            className="rounded-lg border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isRegenerating
                                ? "Regenerating..."
                                : "Regenerate questions"}
                        </button>

                        <button
                            onClick={handleSave}
                            disabled={
                                !isDirty ||
                                isBusy
                            }
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isSaving
                                ? "Saving..."
                                : "Save changes"}
                        </button>

                    </div>

                </div>

                {/* MESSAGES */}

                {(saveMessage || errorMessage) && (
                    <div className="mb-6 space-y-3">

                        {saveMessage && (
                            <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                                {saveMessage}
                            </div>
                        )}

                        {errorMessage && (
                            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {errorMessage}
                            </div>
                        )}

                    </div>
                )}

                <div className="space-y-6">

                    {/* ROLE */}

                    <section className="rounded-xl bg-white p-5 shadow-sm sm:p-6">

                        <div className="mb-5">

                            <h2 className="text-lg font-semibold text-gray-900">
                                Role
                            </h2>

                            <p className="text-sm text-gray-600">
                                Edit the role information used by your preparation kit.
                            </p>

                        </div>

                        <div className="grid gap-4 md:grid-cols-2">

                            <div>

                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Role title
                                </label>

                                <input
                                    value={currentRole.title || ""}
                                    onChange={(event) =>
                                        handleRoleChange(
                                            "title",
                                            event.target.value
                                        )
                                    }
                                    disabled={isBusy}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
                                />

                            </div>

                            <div>

                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Seniority
                                </label>

                                <input
                                    value={currentRole.seniority || ""}
                                    onChange={(event) =>
                                        handleRoleChange(
                                            "seniority",
                                            event.target.value
                                        )
                                    }
                                    disabled={isBusy}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
                                />

                            </div>

                        </div>

                    </section>

                    {/* RESPONSIBILITIES */}

                    <section className="rounded-xl bg-white p-5 shadow-sm sm:p-6">

                        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Responsibilities
                                </h2>

                                <p className="text-sm text-gray-600">
                                    Edit the main responsibilities for this role.
                                </p>
                            </div>

                            <button
                                onClick={handleAddResponsibility}
                                disabled={isBusy}
                                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                + Add responsibility
                            </button>

                        </div>

                        {currentResponsibilities.length === 0 && (
                            <div className="rounded-lg border border-dashed border-gray-300 px-4 py-8 text-center">

                                <p className="text-sm font-medium text-gray-700">
                                    No responsibilities yet.
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                    Add a responsibility to customize this section.
                                </p>

                            </div>
                        )}

                        <div className="space-y-3">

                            {currentResponsibilities.map(
                                (responsibility, index) =>
                                (
                                    <div
                                        key={index}
                                        className="flex flex-col gap-2 sm:flex-row"
                                    >

                                        <textarea
                                            value={responsibility}
                                            onChange={(event) =>
                                                handleResponsibilityChange(
                                                    index,
                                                    event.target.value
                                                )
                                            }
                                            disabled={isBusy}
                                            rows={2}
                                            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
                                        />

                                        <div className="flex gap-2 sm:self-start">

                                            <button
                                                onClick={() =>
                                                    handleMoveResponsibility(
                                                        index,
                                                        "up"
                                                    )
                                                }
                                                disabled={
                                                    index === 0 ||
                                                    isBusy
                                                }
                                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                ↑
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleMoveResponsibility(
                                                        index,
                                                        "down"
                                                    )
                                                }
                                                disabled={
                                                    index ===
                                                    currentResponsibilities.length - 1 ||
                                                    isBusy
                                                }
                                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                ↓
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDeleteResponsibility(
                                                        index
                                                    )
                                                }
                                                disabled={isBusy}
                                                className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </div>
                                )
                            )}

                        </div>

                    </section>

                    {/* REQUIREMENTS */}

                    <section className="rounded-xl bg-white p-5 shadow-sm sm:p-6">

                        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                            <div>

                                <h2 className="text-lg font-semibold text-gray-900">
                                    Requirements
                                </h2>

                                <p className="text-sm text-gray-600">
                                    Control what your preparation kit should cover.
                                </p>

                            </div>

                            <button
                                onClick={handleAddRequirement}
                                disabled={isBusy}
                                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                + Add requirement
                            </button>

                        </div>

                        {currentRequirements.length === 0 && (
                            <div className="mb-4 rounded-lg border border-dashed border-gray-300 px-4 py-8 text-center">

                                <p className="text-sm font-medium text-gray-700">
                                    No requirements yet.
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                    Add a requirement to define what the preparation should cover.
                                </p>

                            </div>
                        )}

                        <div className="space-y-4">

                            {currentRequirements.map(
                                (requirement, index) =>
                                (
                                    <div
                                        key={requirement.id}
                                        className="rounded-lg border border-gray-200 p-4"
                                    >

                                        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                                                {requirement.id}
                                            </span>

                                            <div className="flex gap-2">

                                                <button
                                                    onClick={() =>
                                                        handleMoveRequirement(
                                                            index,
                                                            "up"
                                                        )
                                                    }
                                                    disabled={
                                                        index === 0 ||
                                                        isBusy
                                                    }
                                                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                                >
                                                    ↑
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleMoveRequirement(
                                                            index,
                                                            "down"
                                                        )
                                                    }
                                                    disabled={
                                                        index ===
                                                        currentRequirements.length - 1 ||
                                                        isBusy
                                                    }
                                                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                                >
                                                    ↓
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleDeleteRequirement(
                                                            index
                                                        )
                                                    }
                                                    disabled={isBusy}
                                                    className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </div>

                                        <textarea
                                            value={requirement.text || ""}
                                            onChange={(event) =>
                                                handleRequirementChange(
                                                    index,
                                                    "text",
                                                    event.target.value
                                                )
                                            }
                                            disabled={isBusy}
                                            rows={3}
                                            placeholder="Requirement text..."
                                            className="mb-4 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
                                        />

                                        <div className="grid gap-4 md:grid-cols-2">

                                            <div>

                                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                                    Kind
                                                </label>

                                                <select
                                                    value={requirement.kind || "technical"}
                                                    onChange={(event) =>
                                                        handleRequirementChange(
                                                            index,
                                                            "kind",
                                                            event.target.value
                                                        )
                                                    }
                                                    disabled={isBusy}
                                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:bg-gray-100"
                                                >
                                                    <option value="technical">
                                                        Technical
                                                    </option>

                                                    <option value="behavioural">
                                                        Behavioural
                                                    </option>

                                                    <option value="domain">
                                                        Domain
                                                    </option>

                                                </select>

                                            </div>

                                            <div>

                                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                                    Priority
                                                </label>

                                                <select
                                                    value={requirement.priority || "must"}
                                                    onChange={(event) =>
                                                        handleRequirementChange(
                                                            index,
                                                            "priority",
                                                            event.target.value
                                                        )
                                                    }
                                                    disabled={isBusy}
                                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:bg-gray-100"
                                                >
                                                    <option value="must">
                                                        Must
                                                    </option>

                                                    <option value="nice">
                                                        Nice to have
                                                    </option>

                                                </select>

                                            </div>

                                        </div>

                                    </div>
                                )
                            )}

                        </div>

                    </section>

                    {/* QUESTIONS */}

                    <section className="rounded-xl bg-white p-5 shadow-sm sm:p-6">

                        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                            <div>

                                <h2 className="text-lg font-semibold text-gray-900">
                                    Interview questions
                                </h2>

                                <p className="text-sm text-gray-600">
                                    {currentQuestions.length} questions
                                </p>

                            </div>

                            <button
                                onClick={handleAddQuestion}
                                disabled={isBusy}
                                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                + Add question
                            </button>

                        </div>

                        {currentQuestions.length === 0 && (
                            <div className="mb-4 rounded-lg border border-dashed border-gray-300 px-4 py-8 text-center">

                                <p className="text-sm font-medium text-gray-700">
                                    No interview questions yet.
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                    Add a question manually or regenerate questions from the top.
                                </p>

                            </div>
                        )}

                        <div className="space-y-5">

                            {currentQuestions.map(
                                (question, index) =>
                                {
                                    const requirementIds =
                                        question.requirement_ids ||
                                        [];

                                    const isEdited =
                                        editedQuestionIds.includes(
                                            question.id
                                        );

                                    return (
                                        <div
                                            key={question.id}
                                            className="rounded-xl border border-gray-200 p-5"
                                        >

                                            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                                                <div className="flex items-center gap-2">

                                                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                                                        {question.id}
                                                    </span>

                                                    {isEdited && (
                                                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                                                            Edited
                                                        </span>
                                                    )}

                                                </div>

                                                <div className="flex flex-wrap gap-2">

                                                    <button
                                                        onClick={() =>
                                                            handleMoveQuestion(
                                                                index,
                                                                "up"
                                                            )
                                                        }
                                                        disabled={
                                                            index === 0 ||
                                                            isBusy
                                                        }
                                                        className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                                    >
                                                        ↑
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleMoveQuestion(
                                                                index,
                                                                "down"
                                                            )
                                                        }
                                                        disabled={
                                                            index ===
                                                            currentQuestions.length - 1 ||
                                                            isBusy
                                                        }
                                                        className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                                    >
                                                        ↓
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleDeleteQuestion(
                                                                index
                                                            )
                                                        }
                                                        disabled={isBusy}
                                                        className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </div>

                                            <div className="mb-5 grid gap-4 md:grid-cols-2">

                                                <div>

                                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                                        Category
                                                    </label>

                                                    <select
                                                        value={
                                                            question.category ||
                                                            "technical"
                                                        }
                                                        onChange={(event) =>
                                                            handleQuestionChange(
                                                                index,
                                                                "category",
                                                                event.target.value
                                                            )
                                                        }
                                                        disabled={isBusy}
                                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:bg-gray-100"
                                                    >
                                                        <option value="technical">
                                                            Technical
                                                        </option>

                                                        <option value="behavioural">
                                                            Behavioural
                                                        </option>

                                                        <option value="domain">
                                                            Domain
                                                        </option>

                                                    </select>

                                                </div>

                                                <div>

                                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                                        Difficulty
                                                    </label>

                                                    <select
                                                        value={
                                                            question.difficulty ||
                                                            1
                                                        }
                                                        onChange={(event) =>
                                                            handleQuestionChange(
                                                                index,
                                                                "difficulty",
                                                                Number(
                                                                    event.target.value
                                                                )
                                                            )
                                                        }
                                                        disabled={isBusy}
                                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:bg-gray-100"
                                                    >
                                                        <option value={1}>
                                                            1 · Easy
                                                        </option>

                                                        <option value={2}>
                                                            2 · Medium
                                                        </option>

                                                        <option value={3}>
                                                            3 · Hard
                                                        </option>

                                                    </select>

                                                </div>

                                            </div>

                                            <div className="mb-5">

                                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                                    Question
                                                </label>

                                                <textarea
                                                    value={
                                                        question.prompt ||
                                                        ""
                                                    }
                                                    onChange={(event) =>
                                                        handleQuestionChange(
                                                            index,
                                                            "prompt",
                                                            event.target.value
                                                        )
                                                    }
                                                    disabled={isBusy}
                                                    rows={4}
                                                    className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none transition-colors focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
                                                />

                                            </div>

                                            <div className="mb-5">

                                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                                    Answer outline
                                                </label>

                                                <textarea
                                                    value={
                                                        question.answer_outline ||
                                                        ""
                                                    }
                                                    onChange={(event) =>
                                                        handleQuestionChange(
                                                            index,
                                                            "answer_outline",
                                                            event.target.value
                                                        )
                                                    }
                                                    disabled={isBusy}
                                                    rows={5}
                                                    className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none transition-colors focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
                                                />

                                            </div>

                                            <div>

                                                <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

                                                    <label className="text-sm font-medium text-gray-700">
                                                        Requirements covered
                                                    </label>

                                                    <span className="text-xs text-gray-500">
                                                        {requirementIds.length} selected
                                                    </span>

                                                </div>

                                                <div className="space-y-2 rounded-lg border border-gray-200 p-3">

                                                    {currentRequirements.length === 0 ? (
                                                        <p className="px-2 py-3 text-xs text-gray-500">
                                                            No requirements available to link.
                                                        </p>
                                                    ) : (
                                                        currentRequirements.map(
                                                            (requirement) =>
                                                            {
                                                                const isSelected =
                                                                    requirementIds.includes(
                                                                        requirement.id
                                                                    );

                                                                return (
                                                                    <label
                                                                        key={
                                                                            requirement.id
                                                                        }
                                                                        className="flex cursor-pointer items-start gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
                                                                    >

                                                                        <input
                                                                            type="checkbox"
                                                                            checked={
                                                                                isSelected
                                                                            }
                                                                            onChange={() =>
                                                                                handleRequirementToggle(
                                                                                    index,
                                                                                    requirement.id
                                                                                )
                                                                            }
                                                                            disabled={isBusy}
                                                                            className="mt-1"
                                                                        />

                                                                        <div>

                                                                            <div className="flex flex-wrap items-center gap-2">

                                                                                <span className="text-xs font-medium text-gray-500">
                                                                                    {
                                                                                        requirement.id
                                                                                    }
                                                                                </span>

                                                                                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                                                                                    {
                                                                                        requirement.priority
                                                                                    }
                                                                                </span>

                                                                                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                                                                                    {
                                                                                        requirement.kind
                                                                                    }
                                                                                </span>

                                                                            </div>

                                                                            <p className="mt-1 text-sm text-gray-700">
                                                                                {
                                                                                    requirement.text
                                                                                }
                                                                            </p>

                                                                        </div>

                                                                    </label>
                                                                );
                                                            }
                                                        )
                                                    )}

                                                </div>

                                            </div>

                                        </div>
                                    );
                                }
                            )}

                        </div>

                    </section>

                    {/* FLASHCARDS */}

                    <section className="rounded-xl bg-white p-5 shadow-sm sm:p-6">

                        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                            <div>

                                <h2 className="text-lg font-semibold text-gray-900">
                                    Flashcards
                                </h2>

                                <p className="text-sm text-gray-600">
                                    Edit the quick revision material for this kit.
                                </p>

                            </div>

                            <button
                                onClick={handleAddFlashcard}
                                disabled={isBusy}
                                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                + Add flashcard
                            </button>

                        </div>

                        {currentFlashcards.length === 0 && (
                            <div className="mb-4 rounded-lg border border-dashed border-gray-300 px-4 py-8 text-center">

                                <p className="text-sm font-medium text-gray-700">
                                    No flashcards yet.
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                    Add a flashcard to create quick revision material.
                                </p>

                            </div>
                        )}

                        <div className="space-y-5">

                            {currentFlashcards.map(
                                (flashcard, index) =>
                                (
                                    <div
                                        key={flashcard.id}
                                        className="rounded-xl border border-gray-200 p-5"
                                    >

                                        <div className="mb-4 flex items-center justify-between">

                                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                                                {flashcard.id}
                                            </span>

                                            <button
                                                onClick={() =>
                                                    handleDeleteFlashcard(
                                                        index
                                                    )
                                                }
                                                disabled={isBusy}
                                                className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                Delete
                                            </button>

                                        </div>

                                        <div className="grid gap-4 md:grid-cols-2">

                                            <div>

                                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                                    Front
                                                </label>

                                                <textarea
                                                    value={
                                                        flashcard.front ||
                                                        ""
                                                    }
                                                    onChange={(event) =>
                                                        handleFlashcardChange(
                                                            index,
                                                            "front",
                                                            event.target.value
                                                        )
                                                    }
                                                    disabled={isBusy}
                                                    rows={4}
                                                    className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none transition-colors focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
                                                />

                                            </div>

                                            <div>

                                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                                    Back
                                                </label>

                                                <textarea
                                                    value={
                                                        flashcard.back ||
                                                        ""
                                                    }
                                                    onChange={(event) =>
                                                        handleFlashcardChange(
                                                            index,
                                                            "back",
                                                            event.target.value
                                                        )
                                                    }
                                                    disabled={isBusy}
                                                    rows={4}
                                                    className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none transition-colors focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
                                                />

                                            </div>

                                        </div>

                                        <div className="mt-5">

                                            <div className="mb-2 flex items-center justify-between">

                                                <label className="text-sm font-medium text-gray-700">
                                                    Requirements covered
                                                </label>

                                                <span className="text-xs text-gray-500">
                                                    {
                                                        (
                                                            flashcard.requirement_ids ||
                                                            []
                                                        ).length
                                                    } selected
                                                </span>

                                            </div>

                                            <div className="space-y-2 rounded-lg border border-gray-200 p-3">

                                                {currentRequirements.length === 0 ? (
                                                    <p className="px-2 py-3 text-xs text-gray-500">
                                                        No requirements available to link.
                                                    </p>
                                                ) : (
                                                    currentRequirements.map(
                                                        (requirement) =>
                                                        {
                                                            const selected =
                                                                (
                                                                    flashcard.requirement_ids ||
                                                                    []
                                                                ).includes(
                                                                    requirement.id
                                                                );

                                                            return (
                                                                <label
                                                                    key={
                                                                        requirement.id
                                                                    }
                                                                    className="flex cursor-pointer items-start gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
                                                                >

                                                                    <input
                                                                        type="checkbox"
                                                                        checked={
                                                                            selected
                                                                        }
                                                                        onChange={() =>
                                                                            handleFlashcardRequirementToggle(
                                                                                index,
                                                                                requirement.id
                                                                            )
                                                                        }
                                                                        disabled={isBusy}
                                                                        className="mt-1"
                                                                    />

                                                                    <span className="text-sm text-gray-700">
                                                                        {
                                                                            requirement.text
                                                                        }
                                                                    </span>

                                                                </label>
                                                            );
                                                        }
                                                    )
                                                )}

                                            </div>

                                        </div>

                                    </div>
                                )
                            )}

                        </div>

                    </section>

                </div>

            </div>

        </div>
    );
};

export default KitBuilder;