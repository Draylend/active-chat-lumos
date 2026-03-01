import "./components/active-chat.js";
import "../../component-library/mcq/index.js";

// 1. Get <active-chat>
const chat = document.querySelector("active-chat");

// 2. Create a new <chat-message>
const msg = document.createElement("chat-message");
msg.innerText = "Hi this message was sent from index.js!";
msg.setAttribute("is-user", "true");
msg.setAttribute("sender", "Student");

// 3. Append message FIRST
chat.appendChild(msg);
/*
    // 4. Now get activity
    const activity = chat.getActivity("mcq");

    // 5. Create interaction element
    const activityInteractionElement = activity.createInteractionElement();

    // 6. Create selection
    const selectionElement = document.createElement("selection");
    selectionElement.innerText = "4";

    // 7. Append selection to interaction
    activityInteractionElement.appendChild(selectionElement);

    // 8. Append interaction to message
    msg.appendChild(activityInteractionElement);
*/
// Simulated reply
const reply = document.createElement("chat-message");
reply.innerText = "Wow, this means this works!";
reply.setAttribute("is-user", "false");
reply.setAttribute("sender", "AI Tutor");

chat.appendChild(reply);