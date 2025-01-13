// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"

import "@popperjs/core"
import "bootstrap"

import "controllers"

document.addEventListener("DOMContentLoaded", () => {
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  const chatBox = document.getElementById("chat-box");

  chatForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const userMessage = chatInput.value;
    if (!userMessage) return;

    // Display user's message
    const userMessageDiv = document.createElement("div");
    userMessageDiv.className = "user-message mb-2";
    userMessageDiv.textContent = `You: ${userMessage}`;
    chatBox.appendChild(userMessageDiv);

    // Clear the input
    chatInput.value = "";

    // Send the message to the server
    fetch("/chats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": document.querySelector("[name='csrf-token']").content,
      },
      body: JSON.stringify({ message: userMessage }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Display AI response
        const aiMessageDiv = document.createElement("div");
        aiMessageDiv.className = "ai-message mb-2";
        aiMessageDiv.textContent = `AI: ${data.message}`;
        chatBox.appendChild(aiMessageDiv);

        // Scroll to the bottom
        chatBox.scrollTop = chatBox.scrollHeight;
      })
      .catch((error) => console.error("Error:", error));
  });
});
import "trix"
import "@rails/actiontext"
