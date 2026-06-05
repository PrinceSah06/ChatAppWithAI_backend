import { config } from "dotenv";
config(); 

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_AI_KEY, // or whatever env var you use
});  
const systemInstruction = `
You are an expert software developer and AI coding assistant skilled in all programming languages. 
You must ALWAYS respond with a valid JSON object in the following format:
{
  "text": "Your markdown-formatted explanation or response to the user.",
  "fileTree": {
    "filename.js": { "file": { "contents": "code here..." } }
  }
}

Rules:
1. Write clean, readable, and well-structured code.
2. If the user asks for code, provide it inside the "fileTree" object as well as explaining it in the "text" field.
3. If no code is needed, leave "fileTree" as an empty object {}.
4. Do NOT wrap your response in markdown \`\`\`json blocks. Return ONLY the raw JSON object.
`;


async function main(userPrompt) {
  const combinedPrompt = systemInstruction + "\n\nUser request: " + userPrompt;

  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: combinedPrompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = result.text;
    console.log('---------resopne form  ai start------------- ')
    console.log(text)
    console.log('---------resopne form  ai end------------- ')

    return text;
  } catch (err) {
    console.error("Gemini API error:", err);

    // If it's quota / 429, return a friendly message instead of crashing
    if (err.status === 429) {
      return JSON.stringify({
        text:
          "AI is temporarily unavailable because the quota is exceeded. Please try again later or contact the admin to upgrade the plan.",
        fileTree: null,
      });
    }

    // For other errors, also return something safe
    return JSON.stringify({
      text: "AI failed to respond due to an internal error.",
      fileTree: null,
    });
  }
}

export default main;

// async function main(userPrompt) {
//   const combinedPrompt = systemInstruction + "\n\nUser request: " + userPrompt;

//   const response = await ai.models.generateContent({
//     model: "gemini-3-pro-preview",
//     contents: combinedPrompt,
//   });

//   console.log(response.text);
//   return response.text;
// }

// export default main