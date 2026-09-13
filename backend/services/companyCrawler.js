import * as cheerio from "cheerio";

const normalizeUrl = (url) =>
{
    try
    {
        const parsedUrl = new URL(url);

        parsedUrl.hash = "";

        if (parsedUrl.pathname !== "/")
        {
            parsedUrl.pathname = parsedUrl.pathname.replace(/\/+$/, "");
        }

        return parsedUrl.href;
    }
    catch
    {
        return null;
    }
};

const getAbsoluteUrl = (href, baseUrl) =>
{
    try
    {
        return normalizeUrl(new URL(href, baseUrl).href);
    }
    catch
    {
        return null;
    }
};

const isInternalUrl = (url, baseUrl) =>
{
    try
    {
        return new URL(url).hostname === new URL(baseUrl).hostname;
    }
    catch
    {
        return false;
    }
};

const scoreLink = (url, anchorText = "") =>
{
    const pathname = new URL(url).pathname.toLowerCase();
    const text = anchorText.toLowerCase();

    const highPriorityKeywords = [
        "career",
        "careers",
        "job",
        "jobs",
        "hiring",
        "company",
        "about",
        "culture"
    ];

    const mediumPriorityKeywords = [
        "team",
        "work",
        "life",
        "values"
    ];

    const lowPriorityKeywords = [
        "product",
        "products",
        "education",
        "support",
        "docs",
        "documentation",
        "store",
        "shop",
        "windows",
        "surface",
        "microsoft 365",
        "teams"
    ];

    let score = 0;

    highPriorityKeywords.forEach((keyword) =>
    {
        if (pathname.includes(keyword))
        {
            score += 10;
        }

        if (text.includes(keyword))
        {
            score += 15;
        }
    });

    mediumPriorityKeywords.forEach((keyword) =>
    {
        if (pathname.includes(keyword))
        {
            score += 5;
        }

        if (text.includes(keyword))
        {
            score += 7;
        }
    });

    lowPriorityKeywords.forEach((keyword) =>
    {
        if (pathname.includes(keyword))
        {
            score -= 10;
        }

        if (text.includes(keyword))
        {
            score -= 8;
        }
    });

    return score;
};

const fetchPage = async (url) =>
{
    const maxAttempts = 3;
    const timeoutMs = 10000;

    for (let attempt = 1; attempt <= maxAttempts; attempt++)
    {
        try
        {
            const controller = new AbortController();

            const timeout = setTimeout
            (
                () =>
                {
                    controller.abort();
                },
                timeoutMs
            );

            const response = await fetch
            (
                url,
                {
                    signal: controller.signal
                }
            );

            clearTimeout(timeout);

            if (!response.ok)
            {
                throw new Error(`Page returned ${response.status}`);
            }

            const contentType = response.headers.get("content-type") || "";

            if (!contentType.includes("text/html"))
            {
                throw new Error("Page did not return HTML");
            }

            const contentLength = response.headers.get("content-length");

            if (contentLength && Number(contentLength) > 2_000_000)
            {
                throw new Error("Page is too large");
            }

            const html = await response.text();

            if (html.length > 2_000_000)
            {
                throw new Error("Page is too large");
            }

            const $ = cheerio.load(html);

            $("script, style, noscript").remove();

            const title = $("title")
    .text()
    .replace("Your Privacy Choices Opt-Out Icon", "")
    .trim();

            const text = $("body")
                .text()
                .replace(/\s+/g, " ")
                .trim();

            return {
                url,
                title,
                text,
                html
            };
        }
        catch (error)
        {
            if (attempt === maxAttempts)
            {
                throw new Error
                (
                    `Failed after ${maxAttempts} attempts: ${error.message}`
                );
            }

            console.log
            (
                `Attempt ${attempt} failed for ${url}. Retrying...`
            );

            await new Promise
            (
                (resolve) =>
                {
                    setTimeout(resolve, 1000);
                }
            );
        }
    }
};

export const crawlCompany = async (companyUrl) =>
{
    const normalizedCompanyUrl = normalizeUrl(companyUrl);

    if (!normalizedCompanyUrl)
    {
        throw new Error("Invalid company URL");
    }

    const homepage = await fetchPage(normalizedCompanyUrl);

    const $ = cheerio.load(homepage.html);

    const links = [];

    $("a[href]").each
    (
        (_, element) =>
        {
            const href = $(element).attr("href");
            const anchorText = $(element).text().trim();

            const absoluteUrl = getAbsoluteUrl
            (
                href,
                normalizedCompanyUrl
            );

            if (
                absoluteUrl &&
                isInternalUrl
                (
                    absoluteUrl,
                    normalizedCompanyUrl
                )
            )
            {
                links.push
                (
                    {
                        url: absoluteUrl,
                        anchorText
                    }
                );
            }
        }
    );

    const uniqueLinks = [
        ...new Map
        (
            links.map((link) => [link.url, link])
        ).values()
    ]
        .filter((link) => link.url !== normalizedCompanyUrl)
        .sort
        (
            (a, b) =>
            {
                return scoreLink(b.url, b.anchorText) -
                    scoreLink(a.url, a.anchorText);
            }
        );

    const usefulLinks = uniqueLinks.slice(0, 5);

    console.log("\nSelected research pages:");

    usefulLinks.forEach((link) =>
    {
        console.log
        (
            `${scoreLink(link.url, link.anchorText)} | ${link.url}`
        );
    });

    const pageContents = [
        {
            url: homepage.url,
            title: homepage.title,
            text: homepage.text
        }
    ];

    for (const link of usefulLinks)
    {
        try
        {
            const page = await fetchPage(link.url);

            pageContents.push
            (
                {
                    url: page.url,
                    title: page.title,
                    text: page.text
                }
            );
        }
        catch (error)
        {
            console.log
            (
                `Skipping ${link.url}: ${error.message}`
            );
        }
    }

    return {
        company: homepage.title,
        pages_used: pageContents.map((page) => page.url),
        page_contents: pageContents
    };
};