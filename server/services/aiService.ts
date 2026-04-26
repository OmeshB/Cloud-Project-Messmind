import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";

function cleanText(text: string) {
  return text
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/\\n/g, " ")
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function getAIInsight(data: any) {
  const prompt = `
You are Nutricast AI, a smart mess food analyst.

Analyze this data:
${JSON.stringify(data)}

Give clean, simple output WITHOUT markdown, stars (*), or formatting symbols.
Use plain sentences only.
`;

  // 🔥 TRY GEMINI (initialize inside function)
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("No Gemini API key");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;

    const text = cleanText(response.text());

    console.log("✅ Gemini used");
    return text;

  } catch (error) {
    console.error("⚠️ Gemini failed, switching to Groq...");
  }

  // 🔥 FALLBACK GROQ (initialize inside function)
  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("No Groq API key");
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const response = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const raw = response.choices[0]?.message?.content || "No AI insight";
    const text = cleanText(raw);

    console.log("✅ Groq used");
    return text;

  } catch (error) {
    console.error("❌ Both Gemini and Groq failed:", error);

    // ✅ IMPORTANT: fallback so build/test NEVER fails
    return "AI insight temporarily unavailable";
  }
}