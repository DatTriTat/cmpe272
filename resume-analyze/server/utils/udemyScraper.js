import { ApifyClient } from 'apify-client';

const client = new ApifyClient({
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
    const run = await client.actor("natanielsantos/udemy-courses-scraper").call(input);

    // Fetch results
    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    // Return course data
    return items.map(course => ({
      title: course.title,
      url: course.url,
      rating: course.rating,
      price: course.price_detail?.price_string || 'N/A'
    }));
  } catch (error) {
    console.error("Apify scraping error:", error.message);
    return [];
  }
}
