// Class structure for message
class ChatMessage extends HTMLElement {
    static observedAttributes = ["sender", "is-user"];
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        const isUser = this.getAttribute("is-user") === "true"; 
        const className = isUser ? "text-box-user" : "text-box-ai";

        this.shadowRoot.innerHTML = `
            <style>
                .wrapper {
                    display: flex;
                    width: 100%;
                }

                .text-box-user {
                    background: #FFB81C;
                    border-radius: 12px;
                    padding: 10px;
                    margin-left: auto;
                    max-width: 50%;
                }

                .text-box-ai {
                    color: white;
                    margin-right: auto;
                    max-width: 70%;
                }
            </style>

            <div class="wrapper">
                <div class="${className}">
                    <slot></slot>
                </div>
            </div>
        `;
    }

    attributeChangedCallback() {
        this.connectedCallback();
    }
}

customElements.define("chat-message", ChatMessage);