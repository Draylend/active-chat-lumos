// MCQ Web Component

import "./question.js";
import "./option.js";
class MCQ extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        // Create MCQ box
        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("wrapper");

        // Children (question and options)
        const slot = document.createElement("slot");
        this.wrapper.appendChild(slot);

        // Listen for option selection events
        this.addEventListener('option-selected', (e) => {
            const activityId = this.getAttribute('activity-id');
            const selection = e.detail.selection;
            this.serializeInteraction(activityId, selection);
        });

        const style = document.createElement("style");
        style.textContent = `
            .wrapper {
                padding: 10px;
                border-radius: 20px;
                background: #364741;
                display: flex;
                flex-direction: column;
                box-sizing: border-box;
                gap: 10px;
            }
        `;

        this.shadowRoot.append(style, this.wrapper);
    }

    serializeInteraction(activityId, selection) {
        // Make XML string
        const xmlString = `
<chat-message sender="Student" is-user="true">
    <chat-interaction activity-id="${activityId}">
        <selection>${selection}</selection>
    </chat-interaction>
</chat-message>`.trim();

        this.dispatchEvent(new CustomEvent('interaction-happened', {
            bubbles: true,
            composed: true,
            detail: { xml: xmlString }
        }));
    }
}

customElements.define("multiple-choice-question", MCQ);
