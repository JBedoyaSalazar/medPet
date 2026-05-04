import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "./src/config/env.js";

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);

async function run() {
  try {
    // Actually the SDK doesn't expose listModels directly in an easy way, it's better to fetch via REST if needed,
    // but we can try another common model name. Let's try to fetch model info.
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const res = await model.generateContent("test");
    console.log("gemini-pro works!");
  } catch(e) {
    console.error("gemini-pro error:", e.message);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const res = await model.generateContent("test");
    console.log("gemini-1.5-flash works!");
  } catch(e) {
    console.error("gemini-1.5-flash error:", e.message);
  }
}

run();
