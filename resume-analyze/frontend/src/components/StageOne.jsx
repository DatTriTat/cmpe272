export default function StageOne({ careers, selected, setSelected, onNext }) {
  return (
    <div className="mt-6 bg-white p-6 rounded-xl shadow-md w-full max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">
        Select a Suggested Career Path
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {careers.map((career, idx) => (
          <div
            key={idx}
            onClick={() => setSelected(career)}
            className={`cursor-pointer border p-4 rounded-lg shadow-sm transition-all hover:shadow-md ${
              selected?.title === career.title
                ? "border-blue-600 bg-blue-50"
                : "border-gray-300 bg-white"
            }`}
          >
            <h4 className="font-semibold text-lg mb-1">{career.title}</h4>
            <p className="text-sm text-gray-600 line-clamp-2">
              {career.description}
            </p>
          </div>
        ))}
      </div>

      {selected && (
        <>
          <h3 className="font-semibold text-gray-800 mb-1">Description</h3>
          <p className="text-gray-600 mb-4">{selected.description}</p>
          <h3 className="font-semibold text-gray-800 mb-1">Required Skills</h3>
          <ul className="list-disc list-inside text-gray-600 mb-6">
            {(selected.skills || []).map((skill, idx) => (
              <li key={idx}>{skill}</li>
            ))}
          </ul>
          <button
            onClick={() => onNext(selected)}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-xl"
          >
            Continue to Step 2
          </button>
        </>
      )}
    </div>
  );
}
