// Class structure for active-chat

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
}

customElements.define("active-chat", ActiveChat);