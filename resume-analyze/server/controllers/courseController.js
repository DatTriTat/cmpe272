import { fetchTopUdemyCourses } from "../utils/udemyScraper.js";

export async function getCoursesForSkills(req, res, cachedCoursesCollection) {
  try {
    const { skills } = req.body;
    if (!Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({ error: "Skills array required." });
    }

    const results = [];

    for (const skill of skills) {
      let cached = await cachedCoursesCollection.findOne({
        skill: skill.toLowerCase(),
      });

      if (!cached) {
        const courses = await fetchTopUdemyCourses(skill);
        cached = { skill: skill.toLowerCase(), courses };
        await cachedCoursesCollection.insertOne(cached);
      }

      results.push({
        skill,
        courses: cached.courses,
      });
    }

    res.json(results);
  } catch (error) {
    console.error("Course fetch error:", error.message);
    res.status(500).json({ error: error.message });
  }
}
