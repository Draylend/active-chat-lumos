export class ChatMessage extends HTMLElement {
    static observedAttributes = ["sender", "is-user"];

    constructor() {
        super();

        this.attachShadow({ mode: "open" });

        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("wrapper");

        this.message = document.createElement("div");

        const slot = document.createElement("slot");

        this.message.appendChild(slot);
        this.wrapper.appendChild(this.message);

        const style = document.createElement("style");
        style.textContent = `
            .wrapper {
                display: flex;
                width: 100%;
            }

            .text-box-user {
                background: #364741;
                border-radius: 20px;
                padding: 15px;
                margin-left: auto;
                max-width: 50%;
                margin-bottom: 20px;
                line-height: 24px;
                color: white;
            }

            .text-box-ai {
                color: white;
                margin-right: auto;
                margin-bottom: 10px;
                max-width: 90%;
                line-height: 24px;
            }
        `;

        this.shadowRoot.append(style, this.wrapper);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "is-user") {
            const isUser = newValue === "true";
            this.message.classList.add(
                isUser ? "text-box-user" : "text-box-ai"
            );
        }
    }
}

customElements.define("chat-message", ChatMessage);