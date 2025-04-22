import React, { useEffect, useState } from "react";
import { fetchCourses } from "../utils/fetchCourses";
import { useAuth } from "../context/AuthContext";

export default function StageTwo({ career, onBack, onNext }) {
  const [courses, setCourses] = useState([]);
  const { user } = useAuth();
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);

  useEffect(() => {
    const loadCourses = async () => {
      setIsLoadingCourses(true);
      try {
        const result = await fetchCourses(career.missingSkills, user.token);
        console.log("Courses fetched:", result);
        setCourses(result);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setIsLoadingCourses(false); // Kết thúc loading
      }
    };
    if (career && career.missingSkills?.length > 0) {
      loadCourses();
    }
  }, [career]);

  if (!career)
    return <div className="text-gray-600">Loading career info...</div>;

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-xl">
      <h2 className="text-2xl font-bold text-center mb-4">
        Recommended Courses for {career.title || "Career"}
      </h2>

      {isLoadingCourses ? (
        <p className="text-gray-500 text-center mb-6">Loading courses...</p>
      ) : (
        <ul className="list-disc list-inside text-blue-700 space-y-2 mb-6">
          {courses.length > 0 ? (
            courses.map((entry, idx) => (
              <li key={idx}>
                <strong>{entry.skill}</strong>
                <ul className="ml-4 list-disc">
                  {entry.courses.map((course, cidx) => (
                    <li key={cidx}>
                      <a
                        href={course.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {course.title} ({course.rating || "N/A"})
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))
          ) : (
            <li className="text-gray-500">
              No courses found for missing skills.
            </li>
          )}
        </ul>
      )}

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 px-6 rounded-xl"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-xl"
        >
          Finish
        </button>
      </div>
    </div>
  );
}
