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

        for (const requirementIdOfQuestionObject of question.requirement_ids)
        {
            const requirement = requirementMap.get(requirementIdOfQuestionObject);

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
        (first,second) =>
        {
            return getPriorityScore(second) - getPriorityScore(first);
        }
    );


    const dailyMinutes = 120;

    const days = Array.from({length: daysAvailable},(_,index) =>({day: index + 1,focus: "",question_ids: [],minutes: dailyMinutes}));


    if (sortedQuestions.length === 0)
    {
        for (const day of days)
        {
            day.focus = "Review";
            day.minutes = 90;
        }

        return {days_available: daysAvailable,days};
    }


    const foundationDays = Math.max(1,Math.floor(daysAvailable * 0.3));


    const revisionDays = daysAvailable >= 4? Math.max(1,Math.floor(daysAvailable * 0.2)): 0;


    const practiceDays = Math.max(1,daysAvailable - (foundationDays + revisionDays));


    const activeDays = foundationDays + practiceDays;


    let questionIndex = 0;

    for (let dayIndex = 0; dayIndex < activeDays; dayIndex++)
    {
        const remainingQuestions = sortedQuestions.length - questionIndex;  //how many questions are not assigned yet
        const remainingDays = activeDays - dayIndex; //How many days still are left

        const questionsForDay = Math.ceil(remainingQuestions / remainingDays);

        const selectedQuestions = sortedQuestions.slice(questionIndex,questionIndex + questionsForDay);

        days[dayIndex].question_ids = selectedQuestions.map
        (
            (question) => question.id
        );

        questionIndex += questionsForDay;


        if (dayIndex < foundationDays)
        {
            days[dayIndex].focus = "Core requirements";
        }
        else
        {
            days[dayIndex].focus = "Interview practice";
        }
    }


    if (revisionDays > 0)
    {
        const revisionStartIndex = activeDays;

        const revisionQuestions = sortedQuestions
            .slice(0,Math.min(sortedQuestions.length,3))
            .map((question) => question.id);


        for (let index = revisionStartIndex; index < days.length; index++)
        {
            days[index].focus = "Revision";
            days[index].minutes = 90;
            days[index].question_ids = revisionQuestions;
        }
    }


    return {days_available: daysAvailable,days};
};


//This code does the following :
//it calculates active days = foundation + practice days
//Then, assigns questions to active days
//Then, takes the top 3 difficult questions and assigns them to all revision days