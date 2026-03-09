// Class structure for active-chat
import { GoogleGenAI } from "@google/genai";
//const ai = new GoogleGenAI({apiKey: `${GEMINI_API_KEY}`});
const ai = new GoogleGenAI({apiKey: `AIzaSyDFmSmMIUm95iMTLimxnz544plxRCmyB_w`});

import { ChatMessage } from "./chat-message.js";
import { parse } from "../parser/parsing_code.js";
class ActiveChat extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });

        // Styling the chat window
        const wrapper = document.createElement('div');
        wrapper.classList.add('chat-box');

        // Styling the structure of messages (column)
        const chat = document.createElement('div');
        chat.classList.add('messages', 'scroll-bar');
        this.chat = chat;

        // Children
        const slot = document.createElement('slot');
        chat.appendChild(slot);

        // Event listener for added messages; calls parser to look at
        // chat-activity and chat-interaction tags
        slot.addEventListener('slotchange', () => {
            // Retrieve all elements (children) added to slot (should be chat-message components)
            const elements = slot.assignedElements({ flatten: true });
            // Check if there are any children (messages) first
            if (elements.length === 0) return;
            
            // Grab most recently added chat-message
            const recentElement = elements[elements.length - 1];
            //const markdownString = recentElement.innerText;

            //if(recentElement.getAttribute("is-user") === "false") {
                // TEMPORARY (DELETE LATER) --- testing purposes (simulate LLM markdown reply)
                let markdownString = null;
                if(recentElement.innerText === "test") {
                    markdownString = `<chat-activity>
    <multiple-choice-question>
    <question-header answer="10">What is 5 + 5?</question-header>
    <option-choice>5</option-choice>
    <option-choice>10</option-choice>
    <option-choice>15</option-choice>
    </multiple-choice-question>
    </chat-activity>`;
                } else if(recentElement.innerText === "hi") {
                    markdownString = `Hello!`;
                } else {
                    markdownString = recentElement.innerHTML;
                }

                // Parse this chat-message component
                parse(markdownString);
            //}
        });

        // Text bar
        const textBar = document.createElement('textarea');
        textBar.classList.add('text-bar');
        textBar.setAttribute("placeholder", "Write anything");

        // Expose for external access
        this.textBar = textBar;

        wrapper.append(chat, textBar);

        const style = document.createElement('style');
        style.textContent = `
            .chat-box {
                height: 90vh;
                width: 100%;
                border-radius: 12px;
                display: flex;
                padding: 15px;
                flex-direction: column;
                box-sizing: border-box;
                overflow-y: auto;
            }

            .messages {
                flex: 1;
                gap: 15px;
                display: flex;
                flex-direction: column;
                overflow-y: auto;
                padding-bottom: 15px;
            }

            /* Hide Scrollbar for seamless design */
            .messages {
                overflow-y: scroll;
                scrollbar-width: none; /* Firefox */
            }

            .messages::-webkit-scrollbar {
                display: none; /* Chrome/Safari/Edge */
            }

            .text-bar {
                color: white;
                position: sticky;
                bottom: 0;
                height: 12vh;
                border-radius: 20px;
                background: #364741;
                padding: 15px;
                box-sizing: border-box;
                box-shadow: 0 0 0 1px #91beae;
            }
        `;

        shadow.append(style, wrapper);
    }

    // Use this to attach events on call
    connectedCallback() {
        this.attachEvents();
    }

    // Adding events to textbar and chat interactions
    attachEvents() {
        // If enter key is pressed (without shift key)
        this.textBar.addEventListener("keydown", (e) => {
            // Only submit on enter (enter + shift = newline)
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();

                // If message is empty return
                const message = this.textBar.value.trim();
                if (!message) return;

                // Add new message to chat
                const newMessage = document.createElement('chat-message');
                newMessage.innerText = message;
                newMessage.setAttribute("is-user", "true");
                newMessage.setAttribute("sender", "Student");
                this.appendChild(newMessage);

                // Auto-scroll to bottom when a new message is added
                this.chat.scrollTop = this.chat.scrollHeight;

                // Reset value
                this.textBar.value = "";

                // trigger llm interaction
                this.llmInteraction(message);
            }
        });

        // Chat interaction
        this.addEventListener('interaction-happened', (e) => {
            const xml = e.detail.xml;

            // Add new message to chat
            const newMessage = document.createElement('chat-message');
            newMessage.setAttribute("is-user", "true");
            newMessage.setAttribute("sender", "Student");
            newMessage.innerHTML = xml;
            this.appendChild(newMessage);
        });

        // Replay Integrity -- add refresh listener
        document.addEventListener("DOMContentLoaded", () => {
            console.log("Page loaded!");

            // Grab Chat Log (wherever it's stored)
            const log = false;  // temp

            // Check if log exists; if not, don't replay events (there are none)
            if(log) {
                const chatMessages = null;

                chatMessages.forEach(message => {
                    parse(message);
                });
            }
        });
    }

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

        // Auto-scroll to bottom when a new message is added
        this.chat.scrollTop = this.chat.scrollHeight;
    }
}

customElements.define("active-chat", ActiveChat);