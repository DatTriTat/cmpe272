import axios from "axios";

function transformJSearchJob(job) {
  if (!job || !job.job_title || !job.employer_name || !job.job_apply_link) return null;

  return {
    id: job.job_id,
    title: job.job_title.trim(),
    company: job.employer_name.trim(),
    location: [job.job_city, job.job_state].filter(Boolean).join(", "),
    type: job.job_employment_type || "Unknown",
    remote: !!job.job_is_remote,
    posted: job.job_posted_at_datetime_utc || null,
    description: job.job_description || "",
    salary: job.job_min_salary && job.job_max_salary ? {
      min: job.job_min_salary,
      max: job.job_max_salary,
      currency: job.job_salary_currency || "USD",
    } : null,
    link: job.job_apply_link,
    logoUrl: job.employer_logo || null,
  };
}

export async function fetchFromJSearchAPI({ title, location, type }) {
  const queryString = `${title} jobs in ${location}`;

  const options = {
    method: 'GET',
    url: 'https://jsearch.p.rapidapi.com/search',
    params: {
      query: queryString,
      employment_types: type || undefined,
      page: '1',
      num_pages: '3',
      country: 'us',
    },
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
    },
  };

  try {
    const response = await axios.request(options);
    const rawJobs = response.data.data;

    const jobs = rawJobs.map(transformJSearchJob).filter(Boolean);
    return jobs;
  } catch (err) {
    console.error("Fetch failed:", err.message);
    return [];
  }
}