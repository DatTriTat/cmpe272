import { fetchTopUdemyCourses } from "../utils/udemyScraper.js";

export async function getCoursesForSkillsToolFn(
  { skills },
  cachedCoursesCollection
) {
  if (!Array.isArray(skills) || skills.length === 0) return [];

  const results = [];

  for (const skill of skills) {
    const skillKey = skill.toLowerCase();

    const rawCourses = await fetchTopUdemyCourses(skill);

    const mappedCourses = rawCourses.map((course) => ({
      name: course.name,
      provider: course.provider,
      duration: course.duration,
      url: course.url,
    }));

    await cachedCoursesCollection.updateOne(
      { skill: skillKey },
      {
        $set: {
          courses: mappedCourses,
          lastFetched: new Date(),
        },
      },
      { upsert: true }
    );

    results.push({
      skill,
      courses: mappedCourses,
    });
  }

  return results;
}
