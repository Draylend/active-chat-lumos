//import { marked } from "../../../node_modules/marked/lib/marked.esm.js"; // Import markdown parser

// Recursion Code with DOM Parser
export function parse(mdMessage)
{
    console.log("In parser");

    // Parse from Markdown --> XML
    //const xmlMessage = marked.parse(mdMessage);
    
    // Create DOM Parser Object
    const parser = new DOMParser();
    
    // Parse XML string to create DOM Tree
    const parseInfo = parser.parseFromString(mdMessage, "text/html");

    // Traverse DOM Tree to find unknown tags
    walk(parseInfo.body);
}

// Recursively walk/traverse through children
function walk(node) {
    // If activity: call, fetch, and render component
    // Else if interaction: Modify visual state of existing activity
    // Else: Print normal message

    if(node.tagName) {
        if(node.tagName.toLowerCase() === "chat-activity") {
            console.log("Adding activity, fetching component...");

            // Create message wrapper
            const newMessage = document.createElement("chat-message");

            // Set message attributes
            newMessage.setAttribute("is-user", "false");
            newMessage.setAttribute("sender", "AI Tutor");

            // Add activity to Shadow DOM
            newMessage.addActivity(node);
            document.querySelector("active-chat").appendChild(newMessage);

            return;
        } else if(node.tagName.toLowerCase() === "chat-interaction") {
            console.log("Interaction detected, calling accept()");

            // Grab corresponding activity-id
            const currActivityID = node.getAttribute('activity-id');

            // Grab the activity we need to edit
            const currActivity = document.querySelector(`chat-activity[activity-id="${currActivityID}"]`);

            // Call accept to modify visual state
            currActivity.accept(node);

            return;
        }

        // Recursively traverse children
        for (const child of node.childNodes) {
            walk(child);
        }
    } else {
        // Here is where we format LLM plaintext response
    }
}
