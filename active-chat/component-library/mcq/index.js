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

        // Children (quesiton and options)
        const slot = document.createElement("slot");
        this.wrapper.appendChild(slot);

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
}

customElements.define("multiple-choice-question", MCQ);
