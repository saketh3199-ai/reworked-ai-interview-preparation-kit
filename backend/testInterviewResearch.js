import "dotenv/config";
import {researchInterviews} from "./services/interviewResearch.js";

const testInterviewResearch = async () =>
{
    try
    {
        const result = await researchInterviews("ValueLabs");

        console.log("\nCompany:",result.company);

        console.log("\nResult count:",result.results.length);

        console.log("\nResults:");

        result.results.forEach
        (
            (item,index) =>
            {
                console.log(`\n${index + 1}. ${item.title}`);
                console.log(item.url);
                console.log(item.content.slice(0,300));
            }
        );
    }
    catch (error)
    {
        console.error("Interview research failed:",error.message);
    }
};

testInterviewResearch();