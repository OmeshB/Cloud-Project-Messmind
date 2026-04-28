import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import "dotenv/config";

async function testGemini() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hello!");
    console.log("Gemini 1.5 Flash:", result.response.text());
  } catch (e: any) {
    console.error("Gemini Error:", e.message);
  }
}

async function testGroq() {
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: "Hello!" }],
    });
    console.log("Groq LLaMA 3.3:", response.choices[0]?.message?.content);
  } catch (e: any) {
    console.error("Groq Error:", e.message);
  }
}

testGemini();
testGroq();
