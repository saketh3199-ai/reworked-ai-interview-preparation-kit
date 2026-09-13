import {checkCoverage} from "./services/coverageChecker.js";

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
        requirement_ids: ["r1"]
    },
    {
        id: "q2",
        requirement_ids: ["r1"]
    },
    {
        id: "q3",
        requirement_ids: ["r3"]
    }
];

const uncoveredRequirementIds = checkCoverage(requirements,questions);

console.log("Uncovered requirements:",uncoveredRequirementIds);