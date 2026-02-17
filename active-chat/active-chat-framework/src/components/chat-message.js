import { loadActivityComponent } from '../registry-client/index.js' // not sure if this is the name of the file or function name (placeholders currently until client-registry is completed)

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

    async addActivity(tagName) { // do we need pass attributes too? (like id="4", other data, etc)
        const container = this.shadowRoot.querySelector('#activity-slot');

        await loadActivityComponent(tagName);

        const activityElement = document.createElement(tagName);

        // if need to also pass attributes on, do so here

        container.appendChild(activityElement);
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