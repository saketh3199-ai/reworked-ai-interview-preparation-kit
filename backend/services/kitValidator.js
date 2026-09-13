export const validateKit = (kit) =>
{
    const errors = [];

    if (!kit || typeof kit !== "object")
    {
        return {valid: false,errors: ["Kit must be an object"]};
    }

    if (!kit.source || typeof kit.source !== "object")
    {
        errors.push("source is required");
    }

    if (!kit.company_brief || typeof kit.company_brief !== "object")
    {
        errors.push("company_brief is required");
    }

    if (!kit.role || typeof kit.role !== "object")
    {
        errors.push("role is required");
    }

    if (!Array.isArray(kit.questions))
    {
        errors.push("questions must be an array");
    }

    if (!Array.isArray(kit.flashcards))
    {
        errors.push("flashcards must be an array");
    }

    if (!kit.schedule || typeof kit.schedule !== "object")
    {
        errors.push("schedule is required");
    }

    if (!kit.coverage || typeof kit.coverage !== "object")
    {
        errors.push("coverage is required");
    }

    if (errors.length > 0)
    {
        return {valid: false,errors};
    }

    const requirements = kit.role.requirements || [];
    const questions = kit.questions;
    const flashcards = kit.flashcards;
    const schedule = kit.schedule;

    const requirementIds = new Set();

    for (const requirement of requirements)
    {
        if (!requirement.id)
        {
            errors.push("Every requirement must have an id");
            continue;
        }

        if (requirementIds.has(requirement.id))
        {
            errors.push(`Duplicate requirement id: ${requirement.id}`);
        }

        requirementIds.add(requirement.id);

        if (!requirement.text)
        {
            errors.push(`Requirement ${requirement.id} must have text`);
        }

        if (!["technical","behavioural","domain"].includes(requirement.kind))
        {
            errors.push(`Requirement ${requirement.id} has invalid kind`);
        }

        if (!["must","nice"].includes(requirement.priority))
        {
            errors.push(`Requirement ${requirement.id} has invalid priority`);
        }
    }

    const questionIds = new Set();

    for (const question of questions)
    {
        if (!question.id)
        {
            errors.push("Every question must have an id");
            continue;
        }

        if (questionIds.has(question.id))
        {
            errors.push(`Duplicate question id: ${question.id}`);
        }

        questionIds.add(question.id);

        if (!Array.isArray(question.requirement_ids))
        {
            errors.push(`Question ${question.id} requirement_ids must be an array`);
        }
        else
        {
            for (const requirementId of question.requirement_ids)
            {
                if (!requirementIds.has(requirementId))
                {
                    errors.push(`Question ${question.id} references unknown requirement ${requirementId}`);
                }
            }
        }

        if (!question.prompt)
        {
            errors.push(`Question ${question.id} must have a prompt`);
        }

        if (!question.answer_outline)
        {
            errors.push(`Question ${question.id} must have an answer outline`);
        }

        if (![1,2,3].includes(question.difficulty))
        {
            errors.push(`Question ${question.id} has invalid difficulty`);
        }
    }

    const flashcardIds = new Set();

    for (const flashcard of flashcards)
    {
        if (!flashcard.id)
        {
            errors.push("Every flashcard must have an id");
            continue;
        }

        if (flashcardIds.has(flashcard.id))
        {
            errors.push(`Duplicate flashcard id: ${flashcard.id}`);
        }

        flashcardIds.add(flashcard.id);

        if (!Array.isArray(flashcard.requirement_ids))
        {
            errors.push(`Flashcard ${flashcard.id} requirement_ids must be an array`);
        }
        else
        {
            for (const requirementId of flashcard.requirement_ids)
            {
                if (!requirementIds.has(requirementId))
                {
                    errors.push(`Flashcard ${flashcard.id} references unknown requirement ${requirementId}`);
                }
            }
        }

        if (!flashcard.front)
        {
            errors.push(`Flashcard ${flashcard.id} must have a front`);
        }

        if (!flashcard.back)
        {
            errors.push(`Flashcard ${flashcard.id} must have a back`);
        }
    }

    if (!Number.isInteger(schedule.days_available) || schedule.days_available < 1 || schedule.days_available > 60)
    {
        errors.push("schedule.days_available must be an integer between 1 and 60");
    }

    if (!Array.isArray(schedule.days))
    {
        errors.push("schedule.days must be an array");
    }
    else
    {
        if (schedule.days.length !== schedule.days_available)
        {
            errors.push("schedule.days must contain exactly days_available days");
        }

        for (const day of schedule.days)
        {
            if (!Number.isInteger(day.day))
            {
                errors.push("Every schedule day must have an integer day");
            }

            if (!Array.isArray(day.question_ids))
            {
                errors.push(`Schedule day ${day.day} question_ids must be an array`);
            }
            else
            {
                for (const questionId of day.question_ids)
                {
                    if (!questionIds.has(questionId))
                    {
                        errors.push(`Schedule day ${day.day} references unknown question ${questionId}`);
                    }
                }
            }

            if (!Number.isInteger(day.minutes))
            {
                errors.push(`Schedule day ${day.day} minutes must be an integer`);
            }
        }
    }

    return {valid: errors.length === 0,errors};
};


//This code snippet can be easily understood if you understand the relationships between 
//collections