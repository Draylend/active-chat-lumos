// Class structure for message
class ChatMessage extends HTMLElement {
    static observedAttributes = ["sender", "is-user"];
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <style>
                .text-box {
                    height: auto;
                    width: auto;
                    background: #B8B8B8;
                    border-radius: 12px;
                    padding: 10px;
                    text-align: center;
                }
            </style>

            <div class="text-box">
                <slot></slot>
            </div>
        `;
    }
}

customElements.define("chat-message", ChatMessage);