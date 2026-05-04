import config from "./src/config/env.js";
console.log("Key is:", config.GEMINI_API_KEY ? "DEFINED" : "UNDEFINED", config.GEMINI_API_KEY);
