import "dotenv/config";
import { crawlCompany } from "./services/companyCrawler.js";
import { generateCompanyBrief } from "./services/companyBriefGenerator.js";

const testCompanyBrief = async () =>
{
    try
    {
        const research = await crawlCompany("https://www.microsoft.com");

        const brief = await generateCompanyBrief(research);

        console.log("\nCompany Brief:");
        console.log(brief);

        console.log("\nSources:");

        brief.sources.forEach((source) =>
        {
            console.log(source);
        });
    }
    catch (error)
    {
        console.error("Company brief failed:", error.message);
    }
};

testCompanyBrief();