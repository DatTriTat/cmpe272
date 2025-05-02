import { fetchFromJSearchAPI } from "../utils/jsearchApi.js";

export async function searchJobsService({ title, location, type }) {
  const jobs = await fetchFromJSearchAPI({ title, location, type });
  return jobs;
}