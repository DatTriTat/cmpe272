import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/pipeline", async (req, res) => {
  try {
    console.log("Incoming request body:", JSON.stringify(req.body, null, 2));

    const response = await fetch(
      "https://api.langflow.astra.datastax.com/lf/c5cceb48-7df3-4b9e-a8a0-d50af7573911/api/v1/run/68333838-b8af-4387-9449-9b602300d9e5?stream=false",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.ASTRA_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      }
    );

    const contentType = response.headers.get("content-type") || "";

    if (!response.ok) {
      const errText = await response.text();
      return res.status(502).json({
        error: "Langflow API responded with error",
        status: response.status,
        raw: errText,
      });
    }

    if (!contentType.includes("application/json")) {
      const rawText = await response.text();
      return res.status(502).json({ error: "Invalid response type", raw: rawText });
    }

    const data = await response.json();
    console.log("📦 Langflow response JSON:", JSON.stringify(data, null, 2));

    const jsonText = data.outputs?.[0]?.outputs?.[0]?.results?.text?.data?.text;

    if (!jsonText) {
      return res.status(502).json({ error: "Missing expected text output", raw: data });
    }

    let careers;
    try {
      careers = JSON.parse(jsonText); 
    } catch (err) {
      return res.status(502).json({
        error: "Failed to parse nested JSON",
        raw: jsonText,
      });
    }

    res.json({ careers });
  } catch (err) {
    console.error("❌ Proxy Error:", err.message);
    res.status(500).json({ error: "Proxy server error", detail: err.message });
  }
});


app.listen(4000, () => {
  console.log("🚀 Proxy server running at http://localhost:4000");
});
