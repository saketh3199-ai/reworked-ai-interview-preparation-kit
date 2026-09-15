import {allocateSchedule} from "./services/scheduleAllocator.js";

const requirements =
[
    {
        id: "r1",
        text: "Strong knowledge of JavaScript and TypeScript",
        kind: "technical",
        priority: "must"
    },
    {
        id: "r2",
        text: "Experience building REST APIs with Node.js and Express",
        kind: "technical",
        priority: "must"
    },
    {
        id: "r3",
        text: "Experience with MongoDB and database design",
        kind: "technical",
        priority: "must"
    },
    {
        id: "r4",
        text: "Understanding of React and frontend development",
        kind: "technical",
        priority: "must"
    },
    {
        id: "r5",
        text: "Knowledge of authentication and authorization",
        kind: "technical",
        priority: "must"
    },
    {
        id: "r6",
        text: "Experience with Git and collaborative development",
        kind: "technical",
        priority: "nice"
    }
];


const questions =
[
    {
        id: "q1",
        requirement_ids: ["r1"],
        category: "technical",
        prompt: "Explain the difference between var, let, and const in JavaScript.",
        answer_outline: "Explain scope, reassignment, hoisting, and temporal dead zone.",
        difficulty: 1
    },
    {
        id: "q2",
        requirement_ids: ["r1"],
        category: "technical",
        prompt: "What is the JavaScript event loop and how does it handle asynchronous operations?",
        answer_outline: "Explain call stack, task queue, microtasks, and event loop behavior.",
        difficulty: 3
    },
    {
        id: "q3",
        requirement_ids: ["r2"],
        category: "technical",
        prompt: "How would you design a REST API using Node.js and Express?",
        answer_outline: "Discuss routes, controllers, middleware, validation, errors, and HTTP methods.",
        difficulty: 2
    },
    {
        id: "q4",
        requirement_ids: ["r2"],
        category: "technical",
        prompt: "How would you implement centralized error handling in Express?",
        answer_outline: "Explain error middleware, propagation, status codes, and consistent responses.",
        difficulty: 2
    },
    {
        id: "q5",
        requirement_ids: ["r3"],
        category: "technical",
        prompt: "How would you design MongoDB collections for a hospital management system?",
        answer_outline: "Discuss entities, relationships, embedding versus referencing, and indexes.",
        difficulty: 3
    },
    {
        id: "q6",
        requirement_ids: ["r3"],
        category: "technical",
        prompt: "What is database normalization and when would you avoid over-normalizing?",
        answer_outline: "Explain redundancy, relationships, consistency, and practical tradeoffs.",
        difficulty: 3
    },
    {
        id: "q7",
        requirement_ids: ["r4"],
        category: "technical",
        prompt: "How does React state management work?",
        answer_outline: "Discuss component state, props, lifting state, and global state when needed.",
        difficulty: 1
    },
    {
        id: "q8",
        requirement_ids: ["r4"],
        category: "technical",
        prompt: "What are the advantages of using Redux Toolkit in a React application?",
        answer_outline: "Explain centralized state, slices, reducers, middleware, and simplified Redux patterns.",
        difficulty: 2
    },
    {
        id: "q9",
        requirement_ids: ["r5"],
        category: "technical",
        prompt: "How does JWT authentication work in a web application?",
        answer_outline: "Explain login, token creation, storage considerations, middleware, and authorization.",
        difficulty: 2
    },
    {
        id: "q10",
        requirement_ids: ["r5"],
        category: "technical",
        prompt: "What is the difference between authentication and authorization?",
        answer_outline: "Explain identity verification versus permission checking with examples.",
        difficulty: 1
    },
    {
        id: "q11",
        requirement_ids: ["r6"],
        category: "technical",
        prompt: "How do you use Git when working with a team?",
        answer_outline: "Discuss branches, commits, pull requests, merging, and conflict resolution.",
        difficulty: 1
    },
    {
        id: "q12",
        requirement_ids: ["r2", "r3"],
        category: "system-design",
        prompt: "How would you design a Node.js API that efficiently retrieves large amounts of MongoDB data?",
        answer_outline: "Discuss pagination, indexes, projections, query optimization, and API design.",
        difficulty: 3
    }
];


const result = allocateSchedule
(
    requirements,
    questions,
    10
);

console.log(JSON.stringify(result,null,4));