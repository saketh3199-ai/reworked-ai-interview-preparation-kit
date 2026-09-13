const searchTavily = async (query) =>
{
    const response = await fetch("https://api.tavily.com/search",{method: "POST",headers:{"Content-Type": "application/json","Authorization": `Bearer ${process.env.TAVILY_API_KEY}`},body: JSON.stringify({query,search_depth: "basic",max_results: 5,include_answer: false}),signal: AbortSignal.timeout(10000)});

    if (!response.ok)
    {
        throw new Error(`Tavily search failed with HTTP ${response.status}`);
    }

    return await response.json();
};

const buildSearchQueries = (company) =>
{
    return [
        `"${company}" interview experience`,
        `"${company}" technical interview questions`,
        `"${company}" software engineer interview`,
        `"${company}" full stack developer interview`
    ];
};

export const researchInterviews = async (company) =>
{
    const queries = buildSearchQueries(company);

    const results = [];

    for (const query of queries)
    {
        try
        {
            const searchResult = await searchTavily(query);

            for (const result of searchResult.results || [])
            {
                results.push
                (
                    {
                        title: result.title,
                        url: result.url,
                        content: result.content || ""
                    }
                );
            }
        }
        catch (error)
        {
            console.error(`Interview search failed for "${query}":`,error.message);
        }
    }

    const uniqueResults = Array.from
    (
        new Map
        (
            results.map((result) => [result.url,result])
        ).values()
    );

    const usefulResults = uniqueResults
    .filter((result) => result.content.trim())
    .slice(0,8)
    .map
    (
        (result) =>
        {
            return {
                title: result.title,
                url: result.url,
                content: result.content.slice(0,2000)
            };
        }
    );

    return {company,queries,results: usefulResults};
};