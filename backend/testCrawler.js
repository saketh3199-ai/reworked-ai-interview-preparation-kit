import { crawlCompany } from "./services/companyCrawler.js";

const testCrawler = async () =>
{
    try
    {
        const result = await crawlCompany("https://www.microsoft.com");

        console.log("\nCompany:", result.company);

        console.log("\nPages used:");

        result.pages_used.forEach((url) =>
        {
            console.log(url);
        });

        console.log("\nPage count:", result.page_contents.length);
    }
    catch (error)
    {
        console.error("Crawler failed:", error.message);
    }
};

testCrawler();