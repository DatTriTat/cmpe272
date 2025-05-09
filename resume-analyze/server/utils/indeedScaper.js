import { ApifyClient } from "apify-client";

const apify = new ApifyClient({ token: process.env.APIFY_API_KEY });

function normalizeIndeedUrl(url) {
  try {
    const parsed = new URL(url);
    const jk = parsed.searchParams.get("vjk") || parsed.searchParams.get("jk");
    if (jk) return `https://www.indeed.com/viewjob?jk=${jk}`;
    return url;
  } catch (e) {
    console.warn("Invalid URL format:", url);
    return url;
  }
}

export async function fetchJobDescriptionFromApify(jobUrl) {
  const normalizedUrl = normalizeIndeedUrl(jobUrl);

  const input = {
    startUrls: [{ url: normalizedUrl }],
    proxyConfiguration: { useApifyProxy: true },
  };

  try {
    const run = await apify.actor("misceres/indeed-scraper").call(input);
    const { items } = await apify.dataset(run.defaultDatasetId).listItems();
    console.log("Scraped items:", items.length);

    if (!items || items.length === 0) {
      console.warn("No job data returned for:", normalizedUrl);
      return null;
    }
    return items[0].description || null;
  } catch (err) {
    console.error("Failed to scrape JD from Apify:", err.message);
    return null;
  }
}
