import axios from "axios";
import fs from "fs";
import FormData from "form-data";

export async function parseResume(file) {
  const form = new FormData();
  form.append("file", fs.createReadStream(file.path));

  try {
    const response = await axios.post(
      "https://api.affinda.com/v2/resumes",
      form,
      {
        headers: {
          Authorization: `Bearer ${process.env.AFFINDA_API_KEY}`,
          ...form.getHeaders(),
        },
      }
    );
    return response.data.data; 
  } catch (error) {
    throw new Error("Affinda parsing failed: " + error.message);
  }
}
