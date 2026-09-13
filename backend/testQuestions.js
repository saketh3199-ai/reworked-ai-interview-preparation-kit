import dotenv from "dotenv";
import {generateQuestions} from "./services/questionGenerator.js";

dotenv.config();

const requirement =
{
    id: "r1",
    text: "Strong Node.js experience",
    kind: "technical",
    priority: "must"
};

const testQuestions = async () =>
{
    try
    {
        const questions = await generateQuestions(requirement);

        console.log(JSON.stringify(questions,null,4));
    }
    catch (error)
    {
        console.error("Question Generation Error:",error.message);
    }
};

testQuestions();