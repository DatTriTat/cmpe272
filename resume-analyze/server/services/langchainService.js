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
  
  Your task is to determine the most appropriate next question.
  
  - If the answer is vague, incorrect, or missing key points, generate a follow-up question to clarify or probe deeper.
  - If the answer is already correct, complete, and demonstrates clear understanding, then generate a **new, relevant question** that explores a related or next-level topic **specifically aligned with the ${role} role**.
  
  Avoid repeating the same topic. Keep the question technical, focused, and not generic.
  
  Return only one clear and relevant question.
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

Your task is to give clear and constructive feedback.

- If the answer is correct but could be improved, point out how.
- If the answer is incorrect or incomplete, explain why it is wrong.
- Provide the correct explanation or concept.
- Suggest how the candidate could have answered it better.

Your response should be 2–4 sentences max.
Return only the feedback — do not repeat the question or answer.
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

The question should NOT be trivial — it must assess the candidate's core knowledge in this role. 
Make it challenging enough to differentiate strong candidates from average ones.

Do NOT include any feedback or explanation — just the question.
`;

  const result = await model.call([
    new SystemMessage("You are simulating a job interview."),
    new HumanMessage(prompt),
  ]);

  return result.content.trim();
}

export async function generateInterviewQuestions(role) {
  const prompt = `
You are a senior technical interviewer for a ${role} position.
Create a 10-question interview script that follows this structure:

1. Ask the candidate how many years of experience they have as a ${role}.
2. Ask them to describe the most relevant technical project they’ve worked on in this role.
3-8. Ask increasingly technical and challenging follow-up questions that dig into the candidate’s decision-making, design choices, and tradeoffs from the project. Focus on asking "why" questions.
    - Each question should probe into the candidate’s reasoning, technical depth, and architecture decisions.
    - Example themes: scalability, maintainability, performance, security, tech stack choices, etc.
    - Avoid repeating topics — each question should explore a unique technical angle.

9-10. Ask two **STAR-format** behavioral questions. Use “Tell me about a time when…” phrasing.
    - These should relate to the real-world challenges the candidate might face in a ${role} position (e.g., conflict resolution, production issues, tight deadlines, stakeholder disagreements, team leadership, etc.)

Return the questions as a **JavaScript array of strings**. Do not include explanations, markdown, or code — just the array format.

Example:
[
  "How many years of experience do you have as a backend developer?",
  "Tell me about the most relevant project you've worked on as a backend developer.",
  ...
]
  `;

  const result = await model.call([
    new SystemMessage("You are a senior technical interviewer creating structured interviews."),
    new HumanMessage(prompt),
  ]);

  // Try to safely parse the array if the model returns it as a stringified array
  try {
    const parsed = JSON.parse(result.content);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (err) {
    console.error("Parsing error:", err);
  }

  // Fallback: return as a single string if model failed to follow format
  return [result.content.trim()];
}
