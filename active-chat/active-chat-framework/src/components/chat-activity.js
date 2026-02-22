// Chat Activity Component (Holds interactive embedded activities)

class ChatActivity extends HTMLElement {
    static observedAttributes = ["activity-id"];

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        // Children
        const slot = document.createElement("slot");

        this.shadowRoot.appendChild(slot);
    }
}

customElements.define("chat-activity", ChatActivity);
