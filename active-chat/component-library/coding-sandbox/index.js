class CodingSandbox extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.currentCode = "";
        this.currentOutput = "";
        this.isSubmitted = false;

        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("wrapper");

        this.title = document.createElement("div");
        this.title.classList.add("title");
        this.title.textContent = "Coding Sandbox";

        this.editor = document.createElement("textarea");
        this.editor.classList.add("editor");
        this.editor.placeholder = "Write your C code here...";
        this.editor.spellcheck = false;

        this.buttonRow = document.createElement("div");
        this.buttonRow.classList.add("button-row");

        this.runButton = document.createElement("button");
        this.runButton.classList.add("run-button");
        this.runButton.textContent = "Run Code";

        this.outputBox = document.createElement("pre");
        this.outputBox.classList.add("output-box");
        this.outputBox.textContent = "Program output will appear here.";

        this.buttonRow.appendChild(this.runButton);
        this.wrapper.append(this.title, this.editor, this.buttonRow, this.outputBox);


        this.runButton.addEventListener("click", async () => {
            const activityWrapper = this.closest("chat-activity");
            const activityId = activityWrapper?.getAttribute("activity-id");

            const code = this.editor.value.trim();
            if (!code) {
                this.outputBox.textContent = "Error: no code entered.";
                return;
            }

            this.currentCode = code;

            try {
                const output = await this.compileAndRun(code);
                this.currentOutput = output;
                this.outputBox.textContent = output;

                this.isSubmitted = true;
                this.editor.disabled = true;
                this.runButton.disabled = true;
                this.runButton.classList.add("disabled-hover");

                this.handleInteraction(activityId, code, output);
            } catch (err) {
                const message = `Compilation/Runtime Error:\n${err.message || err}`;
                this.currentOutput = message;
                this.outputBox.textContent = message;
            }
        });


        /*style*/
        const style = document.createElement("style");
        style.textContent = `
            .wrapper {
                padding: 10px;
                border-radius: 20px;
                background: #364741;
                display: flex;
                flex-direction: column;
                box-sizing: border-box;
                gap: 12px;
                color: white;
            }

            .title {
                font-size: 22px;
                font-weight: bold;
                text-align: center;
            }

            .editor {
                min-height: 220px;
                resize: vertical;
                border-radius: 15px;
                border: 1px solid #1f2523;
                background: #2a3431;
                color: white;
                padding: 12px;
                font-family: monospace;
                font-size: 14px;
                box-sizing: border-box;
            }

            .editor:focus {
                outline: none;
                border: 1px solid #23966f;
            }

            .button-row {
                display: flex;
                justify-content: flex-end;
            }

            .run-button {
                background: #2a3431;
                border-radius: 15px;
                color: white;
                border: 1px solid #1f2523;
                padding: 10px 16px;
                cursor: pointer;
            }

            .run-button:hover {
                background: #3e5b52;
                border: 1px solid #23966f;
            }

            .output-box {
                min-height: 120px;
                border-radius: 15px;
                border: 1px solid #1f2523;
                background: #2a3431;
                color: white;
                padding: 12px;
                font-family: monospace;
                font-size: 14px;
                white-space: pre-wrap;
                word-wrap: break-word;
                margin: 0;
            }

            .correct {
                border: 1px solid #00ff51;
                background: #caffd6;
                color: black;
            }

            .wrong {
                border: 1px solid #ff0000;
                background: #ffcaca;
                color: black;
            }

            .disabled-hover:hover {
                background: inherit;
                cursor: default;
            }

            .disabled-hover {
                pointer-events: none;
            }
        `;

        this.shadowRoot.append(style, this.wrapper);
    }

    async compileAndRun(code) {
        /*temporary mock implementation*/
        /*Replace with actual runner.wasm integration*/
        return `Mock run successful.\n\nReceived C code:\n${code}`;
    }

    accept(interactionElement) {
        console.log("In coding-sandbox accept(), editing visual state");

        const currActivityID = interactionElement.getAttribute("activity-id");
        const currActivity = document.querySelector(
            `chat-activity[activity-id="${currActivityID}"]`
        );

        if (!currActivity) return;

        const sandbox = currActivity.querySelector("coding-sandbox");
        if (!sandbox) return;

        const codeNode = interactionElement.querySelector("code");
        const outputNode = interactionElement.querySelector("output");

        const submittedCode = codeNode ? codeNode.textContent : "";
        const submittedOutput = outputNode ? outputNode.textContent : "";

        sandbox.currentCode = submittedCode;
        sandbox.currentOutput = submittedOutput;
        sandbox.isSubmitted = true;

        if (sandbox.shadowRoot) {
            const editor = sandbox.shadowRoot.querySelector(".editor");
            const outputBox = sandbox.shadowRoot.querySelector(".output-box");
            const runButton = sandbox.shadowRoot.querySelector(".run-button");

            if (editor) {
                editor.value = submittedCode;
                editor.disabled = true;
            }

            if (outputBox) {
                outputBox.textContent = submittedOutput;
            }

            if (runButton) {
                runButton.disabled = true;
                runButton.classList.add("disabled-hover");
            }
        }
    }

    handleInteraction(activityId, code, output) {
        const escapedCode = this.escapeXML(code);
        const escapedOutput = this.escapeXML(output);

        const xmlString = `
<chat-interaction activity-id="${activityId}">
    <code>${escapedCode}</code>
    <output>${escapedOutput}</output>
</chat-interaction>`.trim();

        this.dispatchEvent(new CustomEvent("interaction-happened", {
            bubbles: true,
            composed: true,
            detail: {
                xml: xmlString,
                code,
                output
            }
        }));
    }

    escapeXML(str) {
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&apos;");
    }
}

customElements.define("coding-sandbox", CodingSandbox);