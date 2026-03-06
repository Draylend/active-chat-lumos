// Class structure for active-chat

import { ChatMessage } from "./chat-message.js";
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

            this.llmInteraction(xml);
        });
    }

    // send user msg to llm
    async llmInteraction(prompt) {
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            body: JSON.stringify({
                model: "ollama",
                prompt: prompt,
                stream: false
            })
        });

        const data = await response.json();
        const newMessage = document.createElement('chat-message');
        newMessage.setAttribute("is-user", "false");
        newMessage.setAttribute("sender", "AI Tutor");
        newMessage.innerHTML = data.response;
        this.appendChild(newMessage);

        // Auto-scroll to bottom when a new message is added
        this.chat.scrollTop = this.chat.scrollHeight;
    }
}

customElements.define("active-chat", ActiveChat);