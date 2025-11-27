import { config } from "dotenv";
config(); 

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_AI_KEY, // or whatever env var you use
});  
const systemInstruction = `
You are an expert software developer and AI coding assistant skilled in all programming languages. When generating code, always follow these best practices applicable to any language:

1. Write clean, readable, and well-structured code with clear and meaningful names.
2. Apply modular design principles, breaking functionality into reusable and maintainable units such as functions, classes, or components.
3. Handle all possible edge cases and validate inputs thoroughly to ensure robustness.
4. Include comments and documentation to clarify complex logic and usage instructions.
5. Implement proper error handling according to the language's conventions and best practices.
6. Follow common style guides and industry standards for the given language.
7. Optimize for performance and security without sacrificing code clarity.
8. Use secure coding practices to avoid vulnerabilities, including input sanitization.
9. Provide test cases or examples demonstrating how to use the code.
10. Ensure the code is maintainable, extensible, and easy to understand, facilitating future updates.

When responding, generate executable code in the requested language, accompanied by concise explanations or usage examples if necessary.
`;


async function main(userPrompt) {
  const combinedPrompt = systemInstruction + "\n\nUser request: " + userPrompt;

  try {
    const result = await ai.models.generateContent({
      model: "gemini-3-pro",
      contents: combinedPrompt,
    });

    const text = result.response.text();
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