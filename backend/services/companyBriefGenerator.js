import Groq from "groq-sdk";

const groq = new Groq({apiKey: process.env.GROQ_API_KEY});

export const generateCompanyBrief = async (research) =>
{
  const researchText = research.page_contents
    .map
    (
        (page) =>
        {
            const text = page.text.slice(0, 3500);

            return `PAGE: ${page.title}\nURL: ${page.url}\nCONTENT: ${text}`;
        }
    )
    .join("\n\n");

    const prompt = 
    `
        You are generating a company research brief for an interview preparation application.

        Use ONLY the supplied company research.

        Do not invent facts.

        Return valid JSON with exactly these fields:

        {
            "summary": "",
            "what_they_do": ""
        }

        Company research:

        ${researchText}
    `;

    const completion = await groq.chat.completions.create
    (
        {
            model: process.env.GROQ_MODEL,
            messages:
            [
                {
                    role: "system",
                    content: "Return only valid JSON."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0
        }
    );

    const content = completion.choices[0].message.content;

    const brief = JSON.parse(content);

    return {summary: brief.summary,what_they_do: brief.what_they_do,sources: research.pages_used};
};