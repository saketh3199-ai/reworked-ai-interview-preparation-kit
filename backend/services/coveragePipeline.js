import {checkCoverage} from "./coverageChecker.js";
import {generateQuestions} from "./questionGenerator.js";

export const ensureCoverage = async (requirements,questions,interviewResearch) =>
{
    let currentQuestions = [...questions];
    let passes = 1;

    let uncoveredRequirementIds = checkCoverage(requirements,currentQuestions);

    if (uncoveredRequirementIds.length === 0)
    {
        return {questions: currentQuestions,uncoveredRequirementIds: [],passes};
    }

    const uncoveredRequirements = requirements.filter((requirement) =>uncoveredRequirementIds.includes(requirement.id));

    const generatedQuestions = await generateQuestions(uncoveredRequirements,interviewResearch);

    for (const question of generatedQuestions)
    {
        question.id = `q${currentQuestions.length + 1}`;
        currentQuestions.push(question);
    }

    passes++;

    uncoveredRequirementIds = checkCoverage(requirements,currentQuestions);

    return {questions: currentQuestions,uncoveredRequirementIds,passes};
};