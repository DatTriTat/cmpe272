import { BASE_URL } from "../config/config";

export default async function fetchResumePipeline(
  formData: FormData,
  token: string
): Promise<any> {
  const response = await fetch(`${BASE_URL}/api/career/analyze-career`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Server error: ${text}`);
  }

  return await response.json();
}



export async function uploadResumeForAnalysis(file: File, token: string, jobUrl?: string): Promise<any> {
  const formData = new FormData();
  formData.append("file", file);
  if (jobUrl) formData.append("jobUrl", jobUrl);

  const response = await fetch(`${BASE_URL}/api/career/analyze-resume`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to upload and analyze resume");
  }

  const data = await response.json();
  return data.analysis;
}


export async function uploadResumeToMapProfile(file: File, token?: string) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch(`${BASE_URL}/api/profile/map`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Failed to map resume: ${res.status} - ${errText}`);
    }

    return await res.json();
  } catch (err) {
    console.error("Upload to map profile failed:", err);
    throw err;
  }
}

export async function fetchCareerSuggestions(token?: string): Promise<any[]> {
  try {
    const response = await fetch(`${BASE_URL}/api/career/analyze-career`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch suggestions");
    }
    const data = await response.json();
    return data;
  } catch (err: any) {
    console.error("Error in fetchCareerSuggestions:", err.message);
    throw err;
  }
}
