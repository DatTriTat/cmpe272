export default function TextField({ label, type = "text", placeholder }) {
  return (
    <div className="mb-4 text-left">
      <label className="block text-gray-700 font-medium mb-2">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}
