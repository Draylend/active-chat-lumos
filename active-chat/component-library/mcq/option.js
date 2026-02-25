// Option Web Component for MCQ
class OptionChoice extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        // Styling the button
        this.wrapper = document.createElement("button");
        this.wrapper.classList.add("button-style");

        // Children
        const slot = document.createElement("slot");
        this.wrapper.appendChild(slot);

        // On click
        this.wrapper.onclick = () => {
            this.dispatchEvent(new CustomEvent('option-selected', {
                bubbles: true,
                composed: true,
                detail: { selection: this.textContent.trim() }
            }))
        };

        const style = document.createElement("style");
        style.textContent = `
            .button-style {
                background: #2a3431;
                border-radius: 15px;
                color: white;
                width: 100%;
                border: 1px solid #1f2523;
                font-size: 24px;
            }

            button.correct {
                background: #caffd6;
                border: 1px solid #00ff51; 
                color: black;
            }

            button.wrong {
                background: #ffcaca;
                border: 1px solid #ff0000; 
                color: black;
            }

            .button-style:hover {
                background: #3e5b52;
                border: 1px solid #23966f;
            }

            button.disabled-hover:hover {
                background: inherit;
                cursor: default;
            }

            button.disabled-hover {
                pointer-events: none;
            }
        `;

        this.shadowRoot.append(style, this.wrapper);
    }
}

customElements.define("option-choice", OptionChoice);
