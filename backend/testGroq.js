import dotenv from "dotenv";
import {extractRequirementsAndJobInfo} from "./services/requirementExtractor.js";

dotenv.config();

const jd = `
We are looking for a Backend Developer to join our engineering team.

The candidate should have strong experience with Node.js, Express.js,
JavaScript, REST APIs, MongoDB and PostgreSQL.

Experience with authentication, database design, caching, API security
and third party API integration is required.

The candidate should be able to design scalable backend services,
handle errors effectively and write maintainable code.

Good problem solving, communication and teamwork skills are important.
`;

const runTest = async () =>
{
    try
    {
        const jobInfo = await extractRequirementsAndJobInfo(jd);

        console.log("\nExtracted Job Information:\n");
        console.dir(jobInfo,{depth: null});
    }
    catch (error)
    {
        console.error("Test failed:",error.message);
    }
};

runTest();