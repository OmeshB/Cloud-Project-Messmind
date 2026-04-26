import axios from "axios";

const endpoint = process.env.AZURE_CONTENT_SAFETY_ENDPOINT!;
const key = process.env.AZURE_CONTENT_SAFETY_KEY!;

export async function moderateText(text: string) {
  try {
    const res = await axios.post(
      `${endpoint}/contentsafety/text:analyze?api-version=2023-10-01`,
      { text },
      {
        headers: {
          "Ocp-Apim-Subscription-Key": key,
          "Content-Type": "application/json",
        },
      }
    );

    return res.data;
  } catch (err) {
    console.error("❌ Moderation failed:", err);
    return null;
  }
}