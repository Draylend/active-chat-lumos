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

        // For DEMO Presentation, add slotchange event to detect messages
        // being added to give simulated reply
        slot.addEventListener('slotchange', () => {
            // Retrieve all elements (children) added to slot
            const elements = slot.assignedElements({ flatten: true });

            // Grab most recently added element
            const recentElement = elements[elements.length - 1];

            if(recentElement.innerText === "Hello") {
                const newMessage = document.createElement('chat-message');
                newMessage.innerText = "Hi Student! What's on your mind today?";
                newMessage.setAttribute("is-user", "false");
                newMessage.setAttribute("sender", "AI Tutor");
                this.appendChild(newMessage);
            } else if(recentElement.innerText === "Give me an mcq on computer science") {
                const newMessage = document.createElement('chat-message');

                const newActivity = document.createElement('chat-activity');
                const newMCQ = document.createElement('multiple-choice-question');
                const questionHeader = document.createElement('question-header');
                questionHeader.innerText = "What does JS stand for?";
                questionHeader.setAttribute("answer", "JavaScript");

                const optionOne = document.createElement('option-choice');
                optionOne.innerText = "Jury Service";
                const optionTwo = document.createElement('option-choice');
                optionTwo.innerText = "JavaScript";
                const optionThree = document.createElement('option-choice');
                optionThree.innerText = "Juicy Salmon";
                const optionFour = document.createElement('option-choice');
                optionFour.innerText = "Java Syntax";

                newMessage.setAttribute("is-user", "false");
                newMessage.setAttribute("sender", "AI Tutor");
                newMessage.append(newActivity);
                newActivity.append(newMCQ);
                newMCQ.append(questionHeader);
                newMCQ.append(optionOne);
                newMCQ.append(optionTwo);
                newMCQ.append(optionThree);
                newMCQ.append(optionFour);

                this.appendChild(newMessage);
            }
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
                width: 90vw;
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
    }
}

customElements.define("active-chat", ActiveChat);