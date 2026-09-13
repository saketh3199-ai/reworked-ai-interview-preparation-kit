import {generateQuestions} from "./questionGenerator.js";

export const generateQuestionsForRequirements = async (requirements,interviewResearch) =>
{
    if (!Array.isArray(requirements))
    {
        throw new Error("Requirements must be an array");
    }

    return await generateQuestions(requirements,interviewResearch);
};