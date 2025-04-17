export default async function fetchResumePipeline(formData) {
  const response = await fetch("http://localhost:3000/api/career/analyze-career", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Server error: ${text}`);
  }

  return await response.json();
}
