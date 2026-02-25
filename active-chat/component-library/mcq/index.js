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

            // Disable all option buttons
            const options = this.querySelectorAll('option-choice');
            options.forEach(option => {
                const button = option.shadowRoot.querySelector('button');
                button.disabled = true;
                button.classList.add('disabled-hover');
            });
            
            this.handleInteraction(activityId, selection);

            // Grab selected element itself
            const selectedElement = e.target.closest('option-choice');
            const selectedButton = selectedElement.shadowRoot.querySelector('button');

            // Get active-chat to append a message depending on correctness
            const chat = document.querySelector('active-chat');
            const newMessage = document.createElement('chat-message');

            //check answer
            let correctAnswer = false;
            if (selection == this.querySelector('question-header').getAttribute('answer')) {
                correctAnswer = true;
                //console.log("woooooooooooooooooo correct answer");
                selectedButton.classList.add('correct');
                newMessage.innerText = "You got it correct, great job!";
                newMessage.setAttribute("is-user", "false");
                newMessage.setAttribute("sender", "AI Tutor");
            } else {
                selectedButton.classList.add('wrong');
                newMessage.innerText = "Sorry, that is incorrect. The correct answer is JavaScript.";
                newMessage.setAttribute("is-user", "false");
                newMessage.setAttribute("sender", "AI Tutor");
            }

            chat.append(newMessage);
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

    handleInteraction(activityId, selection) { 
        // Serialize XML string
        const xmlString = `
<chat-interaction activity-id="${activityId}">
    <selection>${selection}</selection>
</chat-interaction>`.trim();

        // Dispatch event for active-chat
        this.dispatchEvent(new CustomEvent('interaction-happened', {
            bubbles: true,
            composed: true,
            detail: { xml: xmlString, selection:selection }
        }));
    }
}

customElements.define("multiple-choice-question", MCQ);
