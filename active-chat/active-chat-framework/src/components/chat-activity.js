// Chat Activity Component (Holds interactive embedded activities)

/**
 * Global variable to create activity-ids (made starting id 100)
 */
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

    // Parent accept method -- this will call children's implementation of accept
    accept(interactionElement) {
        this.children[0].accept(interactionElement);
    }
}

customElements.define("chat-activity", ChatActivity);
