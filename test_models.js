import config from "./src/config/env.js";

async function run() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${config.GEMINI_API_KEY}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log("Models:", data.models ? data.models.map(m => m.name) : data);
  } catch(e) {
    console.error("Fetch error:", e.message);
  }
}

run();
