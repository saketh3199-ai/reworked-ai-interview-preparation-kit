import {generateQuestionsForRequirements} from "./services/questionPipeline.js";

const requirements =
[
    {
        id: "r1",
        text: "Strong Node.js experience",
        kind: "technical",
        priority: "must"
    },
    {
        id: "r2",
        text: "Strong MongoDB experience",
        kind: "technical",
        priority: "must"
    }
];

const testPipeline = async () =>
{
    try
    {
        const questions = await generateQuestionsForRequirements(requirements);

        console.log("Total questions:",questions.length);
        console.log(JSON.stringify(questions,null,4));
    }
    catch (error)
    {
        console.error("Question Pipeline Error:",error.message);
    }
};

testPipeline();