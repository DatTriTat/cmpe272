import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function interviewSession(req, res) {
  const { job_title, user_response } = req.body;

  const messages = [
    {
      role: "system",
      content: `You are a private-sector interviewer simulating a real interview for the job: ${job_title}.
Ask one question at a time, wait for the user's response, then give feedback and ask the next question.
Focus on clarity, relevance, and alignment with private-sector norms.`,
    },
    { role: "user", content: user_response }
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages,
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "OpenAI failed" });
  }
}
