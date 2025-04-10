
export default function StageTwo({ career, onBack, onNext }) {
    const courseLinks = {
      "Frontend Developer": [
        { title: "React for Beginners", url: "https://react.dev/learn" },
        { title: "FreeCodeCamp Responsive Web Design", url: "https://www.freecodecamp.org/learn" }
      ],
      "Backend Developer": [
        { title: "Node.js Crash Course", url: "https://nodejs.dev/en/learn" },
        { title: "MongoDB Basics", url: "https://university.mongodb.com" }
      ],
      "Data Analyst": [
        { title: "SQL for Data Science", url: "https://www.coursera.org/learn/sql-for-data-science" },
        { title: "Python for Data Analysis", url: "https://www.udemy.com/course/python-for-data-analysis" }
      ]
    };
  
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-xl">
        <h2 className="text-2xl font-bold text-center mb-4">Recommended Courses for {career}</h2>
        <ul className="list-disc list-inside text-blue-700 space-y-2 mb-6">
          {courseLinks[career]?.map((course, idx) => (
            <li key={idx}>
              <a href={course.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {course.title}
              </a>
            </li>
          ))}
        </ul>
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