// MCQ Web Component

class MCQ extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("wrapper");

        const slot = document.createElement("slot");
        this.wrapper.appendChild(slot);

        const style = document.createElement("style");
        style.textContent = `
            .wrapper {
                
            }
        `;

        this.shadowRoot.append(style, this.wrapper);
    }
}

// Add question, answer, option methods

customElements.define("multiple-choice-question", MCQ);
