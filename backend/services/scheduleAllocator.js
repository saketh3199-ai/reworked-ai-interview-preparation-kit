export const allocateSchedule = (requirements,questions,daysAvailable) =>
{
    const requirementMap = new Map();

    for (const requirement of requirements)
    {
        requirementMap.set(requirement.id,requirement);
    }

    const getPriorityScore = (question) =>
    {
        let score = 0;

        for (const requirementId of question.requirement_ids)
        {
            const requirement = requirementMap.get(requirementId);

            if (requirement?.priority === "must")
            {
                score += 2;
            }

            if (requirement?.priority === "nice")
            {
                score += 1;
            }
        }

        score += question.difficulty;

        return score;
    };

    const sortedQuestions = [...questions].sort
    (
        (a,b) =>
        {
            return getPriorityScore(b) - getPriorityScore(a);
        }
    );

    const dailyMinutes = 120;

    const days = [];

    for (let day = 1; day <= daysAvailable; day++)
    {
        days.push({day,focus: "",question_ids: [],minutes: dailyMinutes});
    }

    sortedQuestions.forEach
    (
        (question,indexOfQuestionObject) =>
        {
            const dayIndex = indexOfQuestionObject % daysAvailable;

            days[dayIndex].question_ids.push(question.id);
        }
    );

    for (const day of days)
    {
        day.focus = day.question_ids.length > 0? `Practice ${day.question_ids.length} questions`: "Review";
    }

    return {days_available: daysAvailable,days};
};