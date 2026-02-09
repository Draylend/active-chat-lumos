// Class structure for active-chat
class ActiveChat extends HTMLElement {
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
                    background-color: #003DA5;
                }            
            
                .chat-box {
                    height: 80vh;
                    width: 60vw;
                    background: #001a46;
                    border-radius: 12px;
                    display: flex;
                    padding: 15px;
                    flex-direction: column;
                    gap: 15px;
                    box-sizing: border-box;
                }

                /* ---------------------------------------------------------------------- */
                /* Make this it's own web component and import into here */
                .text-bar {
                    position: sticky;
                    bottom: 0;
                    border-radius: 20px;
                    background: #003DA5;
                    flex: 0 0 15%;
                    overflow-y: auto;
                    padding: 15px;
                    box-sizing: border-box;
                    box-shadow: 0 5px 10px 10px #001a46;
                }

                .text-bar:empty:before {
                    content: attr(default);
                    color: #a0b0cc;
                }
                /* ---------------------------------------------------------------------- */

                /* Customize scroll bar to make it less ugly */
                .scroll-bar {
                    overflow-y: auto;
                }
            </style>

            <div class="chat-box scroll-bar">
                <slot></slot>

                <!-- This is a temporary NON-working text-bar -->
                <div class="text-bar" contenteditable="true" default="What's on your mind?" ></div>
            </div>
        `;
    }
}

// Add method to add messages to chat
// Do something like document.addID() add message component to body

customElements.define("active-chat", ActiveChat);