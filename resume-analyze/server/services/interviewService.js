
import InterviewSession from "../models/interviewSessionSchema.js";

export async function saveInterviewService({ uid, role, questions }) {
  const session = new InterviewSession({
    uid, 
    role,
    questions,
  });
  await session.save();
  return session;
}

