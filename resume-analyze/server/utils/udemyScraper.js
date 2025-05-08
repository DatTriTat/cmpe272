import { ApifyClient } from 'apify-client';

const apify = new ApifyClient({
  token: process.env.APIFY_API_KEY,
});

export async function fetchTopUdemyCourses(keyword) {
  const searchUrl = `https://www.udemy.com/courses/search/?q=${encodeURIComponent(keyword)}`;

  const input = {
    start_urls: [
      { url: searchUrl }
    ],
    max_items_per_url: 1, 
    proxySettings: {
      useApifyProxy: true
    }
  };

  try {
    // Run the scraper actor
    const run = await apify.actor("natanielsantos/udemy-courses-scraper").call(input, {
      memory: 512,
    });
    // Fetch results
    const { items } = await apify.dataset(run.defaultDatasetId).listItems();
    console.log("Scraped items:", items.length);
    // Return course data
    return items.map((course) => ({
      name: course.title || "Untitled",
      provider: "Udemy",
      duration: course.content_info || "N/A",
      url: course.url || "#",
    }));
  } catch (error) {
    console.error("Apify scraping error:", error.message);
    return [];
  }
}
