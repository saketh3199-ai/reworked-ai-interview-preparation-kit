import Kit from "../models/Kit.js";
// import {extractRequirementsAndJobInfo} from "../services/requirementExtractor.js";
// import {generateQuestionsForRequirements} from "../services/questionPipeline.js";
// import {ensureCoverage} from "../services/coveragePipeline.js";
// import {generateFlashcards} from "../services/flashcardGenerator.js";
// import {allocateSchedule} from "../services/scheduleAllocator.js";
// import { crawlCompany } from "../services/companyCrawler.js";
// import { generateCompanyBrief } from "../services/companyBriefGenerator.js";
// import { researchInterviews } from "../services/interviewResearch.js";
import {generateKitData} from "../services/kitGenerator.js";

// export const createKit = async (req, res) =>
// {
//     try
//     {
//         const {jd, company_url, days} = req.body;

//         if (!jd || typeof jd !== "string" || !jd.trim())
//         {
//             return res.status(400).json({message: "JD is required"});
//         }

//         if (!company_url || typeof company_url !== "string")
//         {
//             return res.status(400).json({message: "Company URL is required"});
//         }

//         let parsedUrl;

//         try
//         {
//             parsedUrl = new URL(company_url);
//         }
//         catch (error)
//         {
//             return res.status(400).json({message: "Invalid company URL"});
//         }

//         if (!["http:","https:"].includes(parsedUrl.protocol))
//         {
//             return res.status(400).json({message: "Company URL must use HTTP or HTTPS"});
//         }

//         if (!Number.isInteger(days) || days < 1 || days > 60)
//         {
//             return res.status(400).json({message: "Preparation days must be an integer between 1 and 60"});
//         }

//         const jobInfo = await extractRequirementsAndJobInfo(jd);

//         const requirements = jobInfo.requirements;

//         const research = await crawlCompany(company_url);

//         const companyBrief = await generateCompanyBrief(research);

//         const interviewResearch = await researchInterviews(research.company);

//         const initialQuestions = await generateQuestionsForRequirements(requirements,interviewResearch);      

//         const coverageResult = await ensureCoverage(requirements,initialQuestions,interviewResearch);

//         const flashcards = generateFlashcards(coverageResult.questions);
        
//         const schedule = allocateSchedule(requirements,coverageResult.questions,days);

//         const kit = await Kit.create
//         (
//             {
//                 user: req.user,
//                 status: "draft",
//                 research:
//                 {
//                     interview: interviewResearch
//                 },
//                 kit:
//                 {
//                     source:{company: research.company,company_url,role: jobInfo.title,location: "",jd_chars: jd.length,researched_at: new Date().toISOString(),pages_used: research.pages_used,jd},

//                     company_brief: companyBrief,

//                     role:{title: jobInfo.title,seniority: jobInfo.seniority,responsibilities: jobInfo.responsibilities,requirements},

//                     questions: coverageResult.questions,

//                     flashcards,

//                     schedule,
                    
//                     coverage:
//                     {
//                         uncovered_requirement_ids: coverageResult.uncoveredRequirementIds,
//                         passes: coverageResult.passes
//                     }
//                 }
//             }
//         );

//         res.status(201).json({message: "Kit created successfully",kitId: kit._id,status: kit.status});
//     }
//     catch (error)
//     {
//         console.error("Kit creation error:", error);
//         res.status(500).json({message: error.message});
//     }
// };



export const createKit = async (req,res) =>
{
    try
    {
        const {jd,company_url,days} = req.body;

        if (!jd || typeof jd !== "string" || !jd.trim())
        {
            return res.status(400).json({message: "JD is required"});
        }

        if (!company_url || typeof company_url !== "string")
        {
            return res.status(400).json({message: "Company URL is required"});
        }

        let parsedUrl;

        try
        {
            parsedUrl = new URL(company_url);
        }
        catch (error)
        {
            return res.status(400).json({message: "Invalid company URL"});
        }

        if (!["http:","https:"].includes(parsedUrl.protocol))
        {
            return res.status(400).json({message: "Company URL must use HTTP or HTTPS"});
        }

        if (!Number.isInteger(days) || days < 1 || days > 60)
        {
            return res.status(400).json({message: "Preparation days must be an integer between 1 and 60"});
        }

        const kitData = await generateKitData(jd,company_url,days);

        const kit = await Kit.create({user: req.user,status: "draft",research: kitData.research,kit: kitData.kit});

        res.status(201).json({message: "Kit created successfully",kitId: kit._id,status: kit.status});
    }
    catch (error)
    {
        console.error("Kit creation error:",error);

        res.status(500).json({message: error.message});
    }
};




export const getKit = async (req, res) =>
{
    try
    {
        const kit = await Kit.findOne({_id: req.params.id,user: req.user});

        if (!kit)
        {
            return res.status(404).json({message: "Kit not found"});
        }

        res.json(kit);
    }
    catch (error)
    {
        console.error("Get Kit error:", error);
        res.status(500).json({message: "Server error"});
    }
};


export const getKits = async (req, res) =>
{
    try
    {
        const kits = await Kit.find({user: req.user}).sort({createdAt: -1});

        res.json(kits);
    }
    catch (error)
    {
        console.error("Get Kits error:", error);
        res.status(500).json({message: "Server error"});
    }
};



export const updateKit = async (req, res) =>
{
    try
    {
        const kit = await Kit.findOne({_id: req.params.id,user: req.user});

        if (!kit)
        {
            return res.status(404).json({message: "Kit not found"});
        }

        const {company_brief,role,questions,flashcards,schedule,builder} = req.body;

        if (company_brief !== undefined)
        {
            kit.kit.company_brief = company_brief;
        }

        if (role !== undefined)
        {
            kit.kit.role = role;
        }

        if (questions !== undefined)
        {
            if (!Array.isArray(questions))
            {
                return res.status(400).json({message: "Questions must be an array"});
            }

            kit.kit.questions = questions;
        }

        if (flashcards !== undefined)
        {
            if (!Array.isArray(flashcards))
            {
                return res.status(400).json({message: "Flashcards must be an array"});
            }

            kit.kit.flashcards = flashcards;
        }

        if (schedule !== undefined)
        {
            kit.kit.schedule = schedule;
        }

        if (builder !== undefined)
        {
            kit.builder = builder;
        }


        await kit.save();

        res.json({message: "Kit updated successfully",kitId: kit._id});
    }
    catch (error)
    {
        console.error("Update Kit error:", error);
        res.status(500).json({message: "Server error"});
    }
};


export const regenerateQuestions = async (req,res) =>
{
    try
    {
        const kit = await Kit.findOne({_id: req.params.id,user: req.user});

        if (!kit)
        {
            return res.status(404).json({message: "Kit not found"});
        }

        const requirements = kit.kit.role.requirements;

        if (!requirements || requirements.length === 0)
        {
            return res.status(400).json({message: "No requirements available for regeneration"});
        }

        const editedQuestionIds = kit.builder?.edited_question_ids || [];

        const preservedQuestions = kit.kit.questions.filter((question) =>editedQuestionIds.includes(question.id));

        const interviewResearch = kit.research?.interview

        

        const generatedQuestions = await generateQuestionsForRequirements(requirements,interviewResearch);

        const preservedIds = new Set(preservedQuestions.map((question) => question.id));

        let nextNumber = 1;

        const getNextQuestionId = () =>
        {
            while (preservedIds.has(`q${nextNumber}`))
            {
                nextNumber++;
            }

            return `q${nextNumber++}`;
        };

        const regeneratedQuestions = generatedQuestions.map
        (
            (question) =>({...question,id: getNextQuestionId()})
        );

        const finalQuestions =[...preservedQuestions,...regeneratedQuestions];

        const coverageResult = await ensureCoverage(requirements,finalQuestions,interviewResearch);

        kit.kit.questions = coverageResult.questions;

        kit.kit.coverage =
        {
            uncovered_requirement_ids: coverageResult.uncoveredRequirementIds,
            passes: coverageResult.passes
        };

        await kit.save();

        res.json
        (
            {
                message: "Questions regenerated successfully",
                questions: coverageResult.questions,
                coverage:
                {
                    uncovered_requirement_ids: coverageResult.uncoveredRequirementIds,
                    passes: coverageResult.passes
                }
            }
        );
    }
    catch (error)
    {
        console.error("Regenerate questions error:",error);

        res.status(500).json
        (
            {
                message: error.message
            }
        );
    }


//basically, what is happening here is, we are protecting the user edited question objects like that, 
//and generating new questions. But while generating new questions, because id conflict might happen, 
//we are dealing with that
};