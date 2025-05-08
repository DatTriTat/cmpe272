import { ApifyClient } from "apify-client";

const apify = new ApifyClient({ token: process.env.APIFY_API_KEY });

export async function fetchJobDescriptionFromApify(jobUrl) {
  const input = {
    startUrls: [{ url: jobUrl }],
    proxyConfiguration: { useApifyProxy: true },
  };

  try {
    const run = await apify.actor("misceres/indeed-scraper").call(input);
    const { items } = await apify.dataset(run.defaultDatasetId).listItems();
    if (!items || items.length === 0) {
      console.warn("No job data returned for:", jobUrl);
      return null;
    }
    return items[0].description || null;
  } catch (err) {
    console.error("Failed to scrape JD from Apify:", err.message);
    return null;
  }
}
