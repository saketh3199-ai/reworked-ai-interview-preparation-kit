import {ensureCoverage} from "./services/coveragePipeline.js";

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
    },
    {
        id: "r3",
        text: "Experience building REST APIs",
        kind: "technical",
        priority: "must"
    }
];

const questions =
[
    {
        id: "q1",
        requirement_ids: ["r1"],
        category: "technical",
        prompt: "Explain Node.js event loop",
        answer_outline: "Explain event loop and asynchronous execution",
        difficulty: 2
    },
    {
        id: "q2",
        requirement_ids: ["r2"],
        category: "technical",
        prompt: "How would you model MongoDB data?",
        answer_outline: "Discuss documents, relationships and indexing",
        difficulty: 2
    }
];

const testCoveragePipeline = async () =>
{
    try
    {
        const result = await ensureCoverage(requirements,questions);
        console.log("Passes:",result.passes);
        console.log("Uncovered:",result.uncoveredRequirementIds);
        console.log("Total questions:",result.questions.length);
        console.log(JSON.stringify(result.questions,null,4));
    }
    catch (error)
    {
        console.error("Coverage Pipeline Error:",error.message);
    }
};

testCoveragePipeline();