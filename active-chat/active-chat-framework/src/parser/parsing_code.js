import { marked } from "../../../node_modules/marked/lib/marked.esm.js"; // Import markdown parser

// Recursion Code with DOM Parser
export function parse(mdMessage)
{
    console.log("In parser");

    // convert marked to html
    const html = marked.parse(mdMessage);

    //parse html to DOM and Create DOM Parser Object
    const parser = new DOMParser();
    const dom = parser.parseFromString(html, "text/html");

    //convert html to xml
    const xmlSerializer = new XMLSerializer();
    const xmlString = xmlSerializer.serializeToString(dom.body);
    console.log("Serialized XML:", xmlString);
    walk(dom.body);

    //const xmlMessage = marked.parse(mdMessage);
    // Parse XML string to create DOM Tree
    //const parseInfo = parser.parseFromString(mdMessage, "text/html");
    // Traverse DOM Tree to find unknown tags
    //walk(parseInfo.body);
}

// Recursively walk/traverse through children
function walk(node) {
    // If activity: call, fetch, and render component
    // Else if interaction: Modify visual state of existing activity
    // Else: Print normal message

    // Add error check for user-input (user should not trigger Markdown/XML detection)
    // Although user message is not parsed initially, it is on replay (as all messages are parsed and appended)

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
