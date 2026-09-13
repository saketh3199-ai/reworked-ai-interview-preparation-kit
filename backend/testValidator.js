import {validateKit} from "./services/kitValidator.js";

const kit = {
    source:
    {
        company: "Test Company",
        company_url: "https://example.com",
        jd: "Backend Engineer",
        role: "Backend Engineer",
        location: "",
        jd_chars: 16,
        researched_at: "",
        pages_used: []
    },
    company_brief:
    {
        summary: "Test summary",
        what_they_do: "Test company",
        sources: []
    },
    role:
    {
        title: "Backend Engineer",
        seniority: "Senior",
        responsibilities: [],
        requirements:
        [
            {
                id: "r1",
                text: "Node.js",
                kind: "technical",
                priority: "must"
            }
        ]
    },
    questions:
    [
        {
            id: "q1",
            requirement_ids: ["r99"],
            category: "technical",
            prompt: "What is Node.js?",
            answer_outline: "Explain Node.js",
            difficulty: 22222
        }
    ],
    flashcards:
    [
        {
            id: "f1",
            front: "What is Node.js?",
            back: "A JavaScript runtime",
            requirement_ids: ["r1"]
        }
    ],
    schedule:
    {
        days_available: 1,
        days:
        [
            {
                day: 1,
                focus: "Node.js",
                question_ids: ["q1123123"],
                minutes: 60
            }
        ]
    },
    coverage:
    {
        uncovered_requirement_ids: [],
        passes: 1
    }
};

console.log(validateKit(kit));