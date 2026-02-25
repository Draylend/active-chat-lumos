// Chat Activity Component (Holds interactive embedded activities)

// Global variable to create activity-ids (made starting id 100)
let activityIdCounter = 100;

class ChatActivity extends HTMLElement {
    static observedAttributes = ["activity-id"];

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        // Children
        const slot = document.createElement("slot");

        this.shadowRoot.appendChild(slot);
    }

    connectedCallback() {
        // assign activity-id
        if (!this.hasAttribute("activity-id")) {
            this.setAttribute("activity-id", activityIdCounter);
            activityIdCounter++;
        }
    }
}

customElements.define("chat-activity", ChatActivity);
