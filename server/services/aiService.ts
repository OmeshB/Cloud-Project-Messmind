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

// 🎨 Rotating insight styles — picked randomly each call
const INSIGHT_STYLES = [
  {
    persona: "a practical mess manager",
    instruction: "Give direct, actionable advice in 2-3 sentences. Focus on what to do tomorrow.",
  },
  {
    persona: "a data analyst",
    instruction: "Focus on the numbers and trends. Highlight ratios, patterns, and what the data suggests statistically.",
  },
  {
    persona: "a food waste reduction expert",
    instruction: "Focus on reducing waste and optimizing quantities. Suggest how to avoid over-preparation.",
  },
  {
    persona: "a student satisfaction advisor",
    instruction: "Think from the students' perspective. What dishes should be promoted and which ones reconsidered?",
  },
  {
    persona: "a nutrition and menu planner",
    instruction: "Comment on menu diversity and suggest ways to improve the balance of dishes offered.",
  },
  {
    persona: "a cost-efficiency consultant",
    instruction: "Focus on cost implications of the demand data. What can be reduced or increased to save resources?",
  },
];

function pickRandomStyle() {
  return INSIGHT_STYLES[Math.floor(Math.random() * INSIGHT_STYLES.length)];
}

export async function getAIInsight(data: any) {
  const style = pickRandomStyle();

  const prompt = `
You are Nutricast AI, acting as ${style.persona} for a college mess.

Analyze this mess demand data:
${JSON.stringify(data)}

${style.instruction}

Rules:
- Give clean output WITHOUT markdown, stars (*), or formatting symbols.
- Use plain sentences only.
- Keep it under 4 sentences.
- Do NOT repeat the exact same phrasing you might have used before — be fresh and specific.
`;

  // 🔥 TRY GEMINI
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("No Gemini API key");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 1.8,   // High randomness → varied outputs each click
        topP: 0.95,
        topK: 64,
      },
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;

    const text = cleanText(response.text());

    console.log(`✅ Gemini used | Style: ${style.persona}`);
    return text;

  } catch (error) {
    console.error("⚠️ Gemini failed, switching to Groq...");
  }

  // 🔥 FALLBACK GROQ
  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("No Groq API key");
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const response = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      temperature: 1.2,     // More varied than the default 1.0
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const raw = response.choices[0]?.message?.content || "No AI insight";
    const text = cleanText(raw);

    console.log(`✅ Groq used | Style: ${style.persona}`);
    return text;

  } catch (error) {
    console.error("❌ Both Gemini and Groq failed:", error);
    return "AI insight temporarily unavailable";
  }
}
