import { searchJobsService } from "../services/jobService.js";

export async function searchJobsController(req, res) {
  try {
    const { title = "", location = "", type = "" } = req.query;
    const jobs = await searchJobsService({ title, location, type });
    res.json(jobs);
  } catch (err) {
    console.error("Error in searchJobsController:", err);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
}