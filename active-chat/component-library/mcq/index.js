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
            const activityId = this.closest('chat-activity').getAttribute('activity-id');
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
    //accept function for MCQ Component
    accept(interactionElement)
    {
        const selectionElement = interactionElement.querySelector("selection");
        const selectedVal = selectionElement.textContent.trim();

        if (!selectionElement)
        {
            return;
        }
        const options = this.querySelectorAll("option");
        options.forEach(option => {
            const value = option.getAttribute("selection");
            if (value == selectedVAl)
            {
                option.style.background = "#4f6f66";
            }   
            else
            {
                option.style.background = "#e03c3c";
            }
            option.setAttribute("disabled", "true");
        })
    }

    serializeInteraction(activityId, selection) {
        // Make XML string
        const xmlString = `
<chat-interaction activity-id="${activityId}">
    <selection>${selection}</selection>
</chat-interaction>`.trim();

        this.dispatchEvent(new CustomEvent('interaction-happened', {
            bubbles: true,
            composed: true,
            detail: { xml: xmlString, selection:selection }
        }));
    }
}

customElements.define("multiple-choice-question", MCQ);
