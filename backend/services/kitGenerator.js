
import {extractRequirementsAndJobInfo} from "./requirementExtractor.js";
import {generateQuestionsForRequirements} from "./questionPipeline.js";
import {ensureCoverage} from "./coveragePipeline.js";
import {generateFlashcards} from "./flashcardGenerator.js";
import {allocateSchedule} from "./scheduleAllocator.js";
import {crawlCompany} from "./companyCrawler.js";
import {generateCompanyBrief} from "./companyBriefGenerator.js";
import {researchInterviews} from "./interviewResearch.js";

export const generateKitData = async (jd,company_url,days) =>
{
    const jobInfo = await extractRequirementsAndJobInfo(jd);

    const requirements = jobInfo.requirements;

    const research = await crawlCompany(company_url);

    const companyBrief = await generateCompanyBrief(research);

    const interviewResearch = await researchInterviews(research.company);

    const initialQuestions = await generateQuestionsForRequirements
    (
        requirements,
        interviewResearch
    );

    const coverageResult = await ensureCoverage
    (
        requirements,
        initialQuestions,
        interviewResearch
    );

    const flashcards = generateFlashcards
    (
        coverageResult.questions
    );

    const schedule = allocateSchedule
    (
        requirements,
        coverageResult.questions,
        days
    );

    return {
        research:
        {
            interview: interviewResearch
        },

        kit:
        {
            source:
            {
                company: research.company,
                company_url,
                role: jobInfo.title,
                location: "",
                jd_chars: jd.length,
                researched_at: new Date().toISOString(),
                pages_used: research.pages_used,
                jd
            },

            company_brief: companyBrief,

            role:
            {
                title: jobInfo.title,
                seniority: jobInfo.seniority,
                responsibilities: jobInfo.responsibilities,
                requirements
            },

            questions: coverageResult.questions,

            flashcards,

            schedule,

            coverage:
            {
                uncovered_requirement_ids: coverageResult.uncoveredRequirementIds,
                passes: coverageResult.passes
            }
        }
    };
};

