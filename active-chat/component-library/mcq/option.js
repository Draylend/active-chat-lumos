// Option Web Component for MCQ
class OptionChoice extends HTMLElement {
    // Hold the unique id of an option
    static observedAttributes = ["option-id"];

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        // Styling the button
        this.wrapper = document.createElement("button");
        this.wrapper.classList.add("button-style");

        // Children
        const slot = document.createElement("slot");
        this.wrapper.appendChild(slot);

        const style = document.createElement("style");
        style.textContent = `
            .button-style {
                background: #2a3431;
                border-radius: 15px;
                color: white;
                width: 100%;
                border: 1px solid #1f2523;
            }

            .button-style:hover {
                background: #3e5b52;
                border: 1px solid #23966f;
            }
        `;

        this.shadowRoot.append(style, this.wrapper);
    }
}

customElements.define("option-choice", OptionChoice);
