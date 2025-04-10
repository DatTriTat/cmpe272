export default async function fetchResumePipeline(inputValue) {
  const response = await fetch("http://localhost:4000/api/pipeline", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      input_value: inputValue,
      output_type: "text",
      input_type: "text",
      tweaks: {
        "Prompt-Wco1n": {},
        "OpenAIModel-ttc4N": {},
        "ChatOutput-CKlBU": {},
        "OpenAIEmbeddings-DFJ7N": {},
        "AstraDB-MN3QQ": {},
        "TextInput-cPEYw": {}
      }
    })
  });

  return await response.json();
}
