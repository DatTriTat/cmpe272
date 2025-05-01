import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const model = new ChatOpenAI({
  temperature: 0.7,
  modelName: "gpt-4o",
  openAIApiKey: process.env.OPENAI_API_KEY,
});

export async function generateFollowupQuestion(
  role,
  previousQuestion,
  previousAnswer
) {
  const prompt = `
You are a technical interviewer for a ${role} position.
The candidate answered:
"${previousAnswer}"
to the question:
"${previousQuestion}"

Based on this, generate a thoughtful and relevant follow-up question.
Return only the follow-up question.
`;

  const result = await model.call([
    new SystemMessage("You are a professional technical interviewer."),
    new HumanMessage(prompt),
  ]);

  return result.text.trim();
}

export async function generateFeedback(role, question, answer) {
  const prompt = `
You are a technical interviewer for a ${role} position.
The candidate answered:
"${answer}"
to the question:
"${question}"

Give 2–3 sentences of constructive, helpful feedback.
Return only the feedback.
`;

  const result = await model.call([
    new SystemMessage("You are an expert at evaluating interview answers."),
    new HumanMessage(prompt),
  ]);

  return result.text.trim();
}

export async function generateFirstQuestion(role) {
    const prompt = `
  You are a professional interviewer for the role of ${role}.
  Start the interview by asking the first technical or behavioral question.
  Do NOT include any feedback or explanation — just the question.
  `;
  
    const result = await model.call([
      new SystemMessage("You are simulating a job interview."),
      new HumanMessage(prompt),
    ]);
  
    return result.content.trim();
  }
  