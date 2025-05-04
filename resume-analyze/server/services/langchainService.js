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

Now, generate a relevant follow-up question.

The follow-up should either:
- Dive deeper into their explanation, asking for reasoning, trade-offs, or how they would apply it in a real scenario, **OR**
- Clarify a key concept or definition if their answer lacked depth or was vague.

Avoid generic or surface-level questions. Focus on evaluating their true understanding and ability to think critically.

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
