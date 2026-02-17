// Class structure for active-chat

import { ChatMessage } from "./chat-message.js";
class ActiveChat extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });

        const wrapper = document.createElement('div');
        wrapper.classList.add('chat-box');

        const chat = document.createElement('div');
        chat.classList.add('messages', 'scroll-bar');
        this.chat = chat;

        const slot = document.createElement('slot');
        chat.appendChild(slot);

        const textBar = document.createElement('div');
        textBar.classList.add('text-bar')

        // Forward contenteditable from host → internal div
        const editable = this.getAttribute('contenteditable') !== 'false';
        textBar.setAttribute('contenteditable', editable);

        // Expose for external access
        this.textBar = textBar;

        wrapper.append(chat, textBar);

        const style = document.createElement('style');
        style.textContent = `
            .chat-box {
                height: 90vh;
                width: 55vw;
                border-radius: 12px;
                display: flex;
                padding: 15px;
                flex-direction: column;
                box-sizing: border-box;
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

            /* ---------------------------------------------------------------------- */
            /* ------------ FIX --------------- */
            /* Make this it's own web component and import into here (later issue) */
            .text-bar {
                position: sticky;
                bottom: 0;
                height: 12vh;
                border-radius: 20px;
                background: #364741;
                padding: 15px;
                box-sizing: border-box;
                box-shadow: 0 0 0 1px #91beae;
            }

            .text-bar:empty:before {
                content: attr(default);
                color: #a0b0cc;
            }
            /* ---------------------------------------------------------------------- */
        `;

        shadow.append(style, wrapper);
    }

    // Public method to add a message element
    addMessage(message) {
        // Ensure it's a ChatMessage element
        if(!(message instanceof ChatMessage)) {
            console.warn("addMessage expects a <chat-message> element");
            return;
        }

        // Ensure it has necessary passed attributes
        if(!(message.hasAttribute("is-user") && message.hasAttribute("sender"))) {
            console.warn("addMessage requires \`is-user\` and \`sender\` attributes");
        }

        this.chat.appendChild(message);

        // Auto-scroll to bottom when a new message is added
        this.chat.scrollTop = this.chat.scrollHeight;
    }
}

customElements.define("active-chat", ActiveChat);