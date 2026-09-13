import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const groq = new Groq({apiKey: process.env.GROQ_API_KEY});

export const extractRequirementsAndJobInfo = async (jd) =>
{
    if (!jd || typeof jd !== "string" || !jd.trim())
    {
        throw new Error("JD is required");
    }

    const response = await groq.chat.completions.create
    (
        {
            model: process.env.GROQ_MODEL,
            messages:
            [
                {
                    role: "system",
                    content:
                    `
                        You are a job description information extraction system.

                        Extract only information that is supported by the job description.

                        Return a JSON object with exactly these fields:

                        title
                        seniority
                        responsibilities
                        requirements

                        title must contain the job title from the job description.

                        seniority must describe the seniority level stated or clearly indicated by the job description.

                        If seniority is not stated or cannot be determined from the job description, return "Not specified".

                        responsibilities must be an array containing responsibilities explicitly supported by the job description.

                        requirements must be an array containing requirement objects.

                        Each requirement must have exactly these fields:
                        id
                        text
                        kind
                        priority

                        Rules for requirements:

                        id must be unique and sequential: r1, r2, r3, etc.

                        text must describe the actual requirement.

                        kind must be one of:
                        technical
                        behavioural
                        domain

                        priority must be either:
                        must
                        nice

                        Mark a requirement as "must" when the job description clearly presents it as required, essential, mandatory, or strongly expected.

                        Mark a requirement as "nice" when the job description presents it as preferred, desirable, bonus, or otherwise optional.

                        Do not invent requirements.

                        Do not invent responsibilities.

                        Do not add explanations.

                        Return only valid JSON.
                    `
                },
                {
                    role: "user",
                    content: jd
                }
            ]
        }
    );

    const content = response.choices[0].message.content;
    console.log("Raw Groq extraction:",content);

    let jobInfo;

    try
    {
        jobInfo = JSON.parse(content);
    }
    catch (error)
    {
        throw new Error("Groq returned invalid JSON");
    }

    if (!jobInfo || typeof jobInfo !== "object" || Array.isArray(jobInfo))
    {
        throw new Error("Groq returned invalid job information format");
    }

    if (!jobInfo.title || typeof jobInfo.title !== "string")
    {
        throw new Error("Groq returned an invalid job title");
    }

    if (!jobInfo.seniority || typeof jobInfo.seniority !== "string")
    {
        throw new Error("Groq returned an invalid seniority");
    }

    if (!Array.isArray(jobInfo.responsibilities))
    {
        throw new Error("Groq returned invalid responsibilities format");
    }

    if (!Array.isArray(jobInfo.requirements))
    {
        throw new Error("Groq returned invalid requirements format");
    }

    const requirementIds = new Set();

    for (const requirement of jobInfo.requirements)
    {
        if (!requirement.id || !requirement.text)
        {
            throw new Error("Groq returned an incomplete requirement");
        }

        if (requirementIds.has(requirement.id))
        {
            throw new Error(`Groq returned duplicate requirement id: ${requirement.id}`);
        }

        requirementIds.add(requirement.id);

        if (!["technical","behavioural","domain"].includes(requirement.kind))
        {
            throw new Error(`Invalid requirement kind: ${requirement.kind}`);
        }

        if (!["must","nice"].includes(requirement.priority))
        {
            throw new Error(`Invalid requirement priority: ${requirement.priority}`);
        }
    }

    console.log("Extracted job info:",JSON.stringify(jobInfo,null,2));
    return jobInfo;
};