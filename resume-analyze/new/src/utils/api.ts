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
  console.log("Verifying ID token:", idToken); // Debugging line
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
