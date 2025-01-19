<template>
  <div class="chat-container">
    <div id="chat-box" class="border p-3 mb-3" style="height: 400px; overflow-y: scroll;">
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="message.type === 'user' ? 'user-message mb-2' : 'ai-message mb-2'"
      >
        <template v-if="message.type === 'user'">
          You: {{ message.content }}<br />
          <div v-if="message.linkedEntryIds.length > 0">
            Attached: {{ message.linkedEntryIds }}
          </div>
        </template>
        <template v-else>
          AI: <span v-html="message.content"></span>
        </template>
      </div>

      <!-- Loading Icon -->
      <div v-if="isLoading" class="loading-icon text-center">
        <span class="spinner-border" role="status" aria-hidden="true"></span>
        <p>AI is thinking...</p>
      </div>
    </div>

    <form @submit.prevent="sendMessage" class="d-flex">
      <input
        id="chatInput"
        v-model="chatInput"
        type="text"
        class="form-control me-2"
        placeholder="Type your message here..."
        autocomplete="off"
      />
      <button type="submit" class="btn btn-primary">Send</button>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useStore } from "vuex";

// Vuex Store
const store = useStore();
const linkedEntryIds = computed(() => store.state.linkedEntryIds);

// Reactive data
const chatInput = ref("");
const messages = reactive([]);
const isLoading = ref(false); // State for loading icon

// Methods
const sendMessage = () => {
  if (!chatInput.value.trim()) return;

  // Add user's message to chat
  messages.push({ type: "user", content: chatInput.value, linkedEntryIds: [...linkedEntryIds.value] });

  const userMessage = chatInput.value;
  chatInput.value = ""; // Clear input field

  isLoading.value = true; // Show loading icon

  // Send the message to the server
  fetch("/chats", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": document.querySelector("[name='csrf-token']").content,
    },
    body: JSON.stringify({ message: userMessage, linkedEntryIds: linkedEntryIds.value }),
  })
    .then((response) => response.json())
    .then((data) => {
      // Add AI response to chat
      messages.push({ type: "ai", content: data.message });
      scrollToBottom();
    })
    .catch((error) => console.error("Error:", error))
    .finally(() => {
      isLoading.value = false; // Hide loading icon
    });
};

const scrollToBottom = () => {
  const chatBox = document.querySelector("#chat-box");
  if (chatBox) {
    chatBox.scrollTop = chatBox.scrollHeight;
  }
};

// Lifecycle hook
onMounted(() => {
  scrollToBottom();
});
</script>

<style>
/* Optional styles for chat bubbles */
.user-message {
  text-align: right;
  background-color: #e7f3ff;
  padding: 8px;
  border-radius: 8px;
}

.ai-message {
  text-align: left;
  background-color: #f1f1f1;
  padding: 8px;
  border-radius: 8px;
}
</style>
