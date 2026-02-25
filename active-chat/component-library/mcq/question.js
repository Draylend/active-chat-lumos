// Question Web Component for MCQ
class QuestionHeader extends HTMLElement {
    // Hold the answer to the question
    static observedAttributes = ["answer"];

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        // Styling the question
        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("wrapper");

        // Children
        const slot = document.createElement("slot");
        this.wrapper.appendChild(slot);

        const style = document.createElement("style");
        style.textContent = `
            .wrapper {
                padding: 0 2vw;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 32px;
            }
        `;

        this.shadowRoot.append(style, this.wrapper);
    }
}

customElements.define("question-header", QuestionHeader);
