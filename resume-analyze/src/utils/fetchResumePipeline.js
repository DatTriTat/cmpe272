export default async function fetchResumePipeline(query) {
  const response = await fetch("http://localhost:3000/analyze-career", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query,
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Server error: ${text}`);
  }

  return await response.json();
}
