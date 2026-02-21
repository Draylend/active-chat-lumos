import "./components/active-chat.js";
import "../../component-library/mcq/index.js"; // Temporary calling to test MCQ -- FIX --

// Example for adding a message to active-chat
// 1. Get your <active-chat> instance
const chat = document.querySelector("active-chat");

// 2. Create a new <chat-message> element
const msg = document.createElement("chat-message");

// 3. Add text content (light DOM)
msg.innerText = "Hi this message was sent from index.js!";

// 4. Add attributes
msg.setAttribute("is-user", "true");
msg.setAttribute("sender", "Student");

// 5. Add the message to the chat
chat.addMessage(msg);

// A simulated reply
const reply = document.createElement('chat-message');
reply.innerText = "Wow, this means this works!";
reply.setAttribute("is-user", "false");
reply.setAttribute("sender", "AI Tutor");
chat.addMessage(reply);