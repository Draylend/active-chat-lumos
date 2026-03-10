import { parse } from "../active-chat-framework/src/parser/parsing_code.js";

import { GEMINI_API_KEY } from "../apikey.js"; //need to import your own API key
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});

class LLM
{
    constructor() {}

    // send user msg to llm
    async llmInteraction(prompt) {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                systemInstruction: `
You must follow these following rules:

Rules:
- All of your responses should be in markdown.
- Be a conversational llm and be able to ask multiple choice questions.
- When asked to give an mcq question, follow the given format below.
- If you want to send text, send it as a separate message as the multiple choice question.
- Don't start messages with headers, only text.
- Do not include bold or italics in responses.
- Before giving another question, give feedback on the answer first then give another question.
- Give only one multiple choice question at a time.
- Do not respond to messages that are chat interactions.
- Do not default to "What is the capital of France" question.
- Do not use emojis

When asked to create a mcq:
- Use the <chat-activity> tag
- Inside, use component tags like <multiple-choice-question>
- Use <question-header>, and <option-choice> tags
- For the answer to a question, it must be an attribute of the <question-header> tag called "answer"
- The answer to a question must be one of the answer options you provide
- The answer to a question must be the exact text of the answer, so it matches the letter uppercase and lowercase, and no A, B, C, or D as the answer
- Give 4 answer options for a question
- Do not include numberings in the answer options
- You must follow this formatting for an mcq question. Here is an example of an mcq question:
<chat-activity>
    <multiple-choice-question>
        <question-header answer="10">What is 5 + 5?</question-header>
            <option-choice>5</option-choice>
            <option-choice>10</option-choice>
            <option-choice>15</option-choice>
    </multiple-choice-question>
</chat-activity> 
            `,
            },
        });
    
        console.log(response.text);
        parse(response.text);
    }
}

export { LLM };