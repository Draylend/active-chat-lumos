// Chat Interaction Component (Does not get rendered)

class ChatInteraction extends HTMLElement {
    static observedAttributes = ["activity-id"];

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        // Children
        const slot = document.createElement("slot");

        this.shadowRoot.append(slot);
    }
}

customElements.define("chat-interaction", ChatInteraction);
