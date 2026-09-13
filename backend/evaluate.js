
import dotenv from "dotenv";
import fs from "fs/promises";
import {generateKitData} from "./services/kitGenerator.js";
import {validateKit} from "./services/kitValidator.js";

dotenv.config();

const getArgument = (name) =>
{
    const index = process.argv.indexOf(name);

    if (index === -1)
    {
        return null;
    }

    return process.argv[index + 1];
};

const inputPath = getArgument("--input");
const outputPath = getArgument("--output");

if (!inputPath || !outputPath)
{
    console.error("Usage: npm run evaluate -- --input <cases.json> --output <kits.json>");
    process.exit(1);
}

const run = async () =>
{
    try
    {
        const inputContent = await fs.readFile(inputPath,"utf8");
        const cases = JSON.parse(inputContent);

        if (!Array.isArray(cases))
        {
            throw new Error("Input file must contain an array of cases");
        }

        const results = [];

        for (const currentCase of cases)
        {
            console.log(`\nProcessing case: ${currentCase.id}`);

            try
            {
                if (!currentCase.id)
                {
                    throw new Error("Case id is required");
                }

                if (!currentCase.jd || typeof currentCase.jd !== "string")
                {
                    throw new Error("Case JD is required");
                }

                if (!currentCase.company_url || typeof currentCase.company_url !== "string")
                {
                    throw new Error("Case company_url is required");
                }

                if (!Number.isInteger(currentCase.days) || currentCase.days < 1 || currentCase.days > 60)
                {
                    throw new Error("Case days must be an integer between 1 and 60");
                }

                const kitData = await generateKitData
                (
                    currentCase.jd,
                    currentCase.company_url,
                    currentCase.days
                );

                const validation = validateKit(kitData.kit);

                if (!validation.valid)
                {
                    throw new Error
                    (
                        `Generated kit validation failed: ${validation.errors.join("; ")}`
                    );
                }

                results.push
                (
                    {
                        id: currentCase.id,
                        status: "ok",
                        kit: kitData.kit,
                        error: null
                    }
                );

                console.log(`Case ${currentCase.id} completed successfully`);
            }
            catch (error)
            {
                console.error(`Case ${currentCase.id} failed:`,error.message);

                results.push
                (
                    {
                        id: currentCase.id,
                        status: "failed",
                        kit: null,
                        error:
                        {
                            code: "GENERATION_FAILED",
                            message: error.message
                        }
                    }
                );
            }
        }

        const output =
        {
            version: "1.0",
            generated_at: new Date().toISOString(),
            kits: results
        };

        await fs.writeFile
        (
            outputPath,
            JSON.stringify(output,null,2),
            "utf8"
        );

        console.log("\nEvaluation completed.");
        console.log(`Output written to: ${outputPath}`);
    }
    catch (error)
    {
        console.error("Evaluation failed:",error.message);
        process.exit(1);
    }
};

run();

