import { BASE_URL } from "../config/config";
export async function saveUserProfile(
  token: string,
  profile: any,
  setUser: (user: any) => void
): Promise<void> {
  try {
    const response = await fetch(`${BASE_URL}/api/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profile),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update profile: ${errorText}`);
    }

    const updatedUser = await response.json();
    setUser((prev: any) => ({
      ...prev,
      profile: updatedUser.profile,
    }));
    console.log("Profile updated successfully");
  } catch (err: any) {
    console.error("Error saving profile:", err.message);
    throw err;
  }
}

export async function verifyIdToken(idToken: string) {
  const res = await fetch(`${BASE_URL}/api/auth/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Token verification failed: ${errorText}`);
  }

  return await res.json();
}

export async function getFirstQuestion(role: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/interview/first-question`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to get first question: ${errorText}`);
  }

  const data = await res.json();
  return data.question;
}

export async function getNextQuestion(
  role: string,
  previousQuestion: string,
  previousAnswer: string
): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/interview/next-question`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role, previousQuestion, previousAnswer }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to get next question: ${errorText}`);
  }

  const data = await res.json();
  return data.question;
}

export async function getFeedback(
  role: string,
  question: string,
  answer: string
): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/interview/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role, question, answer }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to get feedback: ${errorText}`);
  }

  const data = await res.json();
  return data.feedback;
}

// utils/api.ts
export async function saveInterviewSession(
  role: string,
  questions: {
    question: string;
    answer: string;
    feedback: string;
  }[],
  idToken: string // Firebase ID Token
) {
  const response = await fetch(`${BASE_URL}/api/interview/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ role, questions }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to save session");
  }

  return response.json();
}

export async function getInterviewHistory(idToken: string) {
  const response = await fetch(`${BASE_URL}/api/interview/interview-history`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch history");
  }
  return response.json();
}

export interface JobQuery {
  title?: string;
  location?: string;
}

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  remote: boolean;
  posted: string;
  descriptionSnippet: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
  } | null;
  link: string;
  logoUrl?: string | null;
}
export async function fetchJobsFromBackend(query: JobQuery): Promise<Job[]> {
  const params = new URLSearchParams();
  if (query.title) params.append("title", query.title);
  if (query.location) params.append("location", query.location);

  const response = await fetch(
    `${BASE_URL}/api/jobs/search?${params.toString()}`
  );
  const data = await response.json();
  if (!response.ok) throw new Error("Failed to fetch jobs");
  return data;
}

export async function saveCareerResults(token: string, results: any[]) {
  const res = await fetch(`${BASE_URL}/api/career-results`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ results }),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to save career results: ${errorText}`);
  }
  return await res.json();
}

export async function getCareerResults(token: string) {
  const res = await fetch(`${BASE_URL}/api/career-results`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch career results: ${errorText}`);
  }
  const data = await res.json(); 
  const allResults = data.flatMap((entry: any) => entry.results || []);
  return allResults;
}

