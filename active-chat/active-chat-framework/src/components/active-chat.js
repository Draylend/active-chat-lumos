// Class structure for active-chat
class ActiveChat extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });

        const wrapper = document.createElement('div');
        wrapper.classList.add('chat-box');

        const chat = document.createElement('div');
        chat.classList.add('messages', 'scroll-bar');

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
            :host {
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background-color: #003DA5;
            }    

            .chat-box {
                height: 80vh;
                width: 60vw;
                background: #001a46;
                border-radius: 12px;
                display: flex;
                padding: 15px;
                flex-direction: column;
                box-sizing: border-box;
            }

            .messages {
                gap: 15px;
                display: flex;
                flex-direction: column;
            }

            /* Customize scroll bar to make it less ugly */
            .scroll-bar {
                overflow-y: auto;
            }

            /* ---------------------------------------------------------------------- */
            /* Make this it's own web component and import into here */
            .text-bar {
                position: sticky;
                bottom: 0;
                height: full;
                border-radius: 20px;
                background: #003DA5;
                padding: 15px;
                box-sizing: border-box;
                box-shadow: 0 5px 10px 10px #001a46;
            }

            .text-bar:empty:before {
                content: attr(default);
                color: #a0b0cc;
            }
            /* ---------------------------------------------------------------------- */
        `;

        shadow.append(style, wrapper);
    }
}

// Add method to add messages to chat
// Do something like document.addID() add message component to body

customElements.define("active-chat", ActiveChat);