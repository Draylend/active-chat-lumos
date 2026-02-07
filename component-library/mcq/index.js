class mcq extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background-color: #F0FFF3;
                }            
            
                .chat-box {
                    height: 80vh;
                    width: 60vw;
                    background: #EDEDED;
                    border-radius: 12px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            </style>

            <div class="chat-box">
                <slot></slot>
            </div>
        `;
    }
}

// Add method to add messages

customElements.define("mcq", mcq);