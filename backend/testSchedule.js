import {allocateSchedule} from "./services/scheduleAllocator.js";

const requirements =
[
    {
        id: "r1",
        text: "Node.js",
        kind: "technical",
        priority: "must"
    },
    {
        id: "r2",
        text: "MongoDB",
        kind: "technical",
        priority: "must"
    },
    {
        id: "r3",
        text: "Git",
        kind: "technical",
        priority: "nice"
    }
];

const questions =
[
    {
        id: "q1",
        requirement_ids: ["r1"],
        difficulty: 3
    },
    {
        id: "q2",
        requirement_ids: ["r2"],
        difficulty: 2
    },
    {
        id: "q3",
        requirement_ids: ["r3"],
        difficulty: 1
    }
];

const schedule = allocateSchedule(requirements,questions,2);

console.log(JSON.stringify(schedule,null,4));