import { ActivityDiscover } from '../registry_client/registry_client.js';

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

                position: relative;
            }
        `;

        this.shadowRoot.append(style, this.wrapper);

        try
        {
            this.registryClient = new ActivityDiscover();
        }
        catch
        {
            console.error("Failed to access registry_client");
        }
    }

    // Shadow DOM rendering
    async addActivity() {
        // look for <chat-activity> wrapper
        const activityWrapper = this.querySelector('chat-activity');

        // check if message has an activity
        if (!activityWrapper) return;

        // check if there is actually an activity to render
        const activity = activityWrapper.firstElementChild;
        if (!activity) return;

        const tagName = activity.tagName.toLowerCase();
        const activityId = activityWrapper.getAttribute('activity-id');

        try 
        {
            // get component with registry_client
            await this.registryClient.fetchWebComponents(tagName);

            // create
            const activityElement = document.createElement(tagName);
            activityElement.setAttribute('activity-id', activityId);

            activityElement.innerHTML = activity.innerHTML;

            // append
            this.message.appendChild(activityElement);
        }
        catch
        {
            console.error(`Shadow DOM render failed to load <${tagName}/> component:`, err);
        }
    }

    connectedCallback() {
        // allow time for parsing
        setTimeout(() => { this.addActivity(); }, 0);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // Check for is-user attribute and apply class based on attribute value
        if (name === "is-user") {
            const isUser = newValue === "true";
            this.message.classList.add(
                isUser ? "text-box-user" : "text-box-ai"
            );
        }
    }
}

customElements.define("chat-message", ChatMessage);