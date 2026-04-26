import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

function cleanText(text: string) {
  return text
    .replace(/\*\*/g, "")        // remove **
    .replace(/\*/g, "")          // remove *
    .replace(/\\n/g, " ")        // remove \n
    .replace(/\n/g, " ")         // remove real new lines
    .replace(/\s+/g, " ")        // remove extra spaces
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

  // 🔥 TRY GEMINI
  try {
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

  // 🔥 FALLBACK GROQ
  try {
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
    return "AI insight unavailable due to service issues.";
  }
}