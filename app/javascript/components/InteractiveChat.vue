<template>
  <div class="chat-container">
    <div id="chat-box" class="border p-3 mb-3" style="height: 400px; overflow-y: scroll;">
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="message.type === 'user' ? 'user-message mb-2' : 'ai-message mb-2'"
      >
        <template v-if="message.type === 'user'">
          You: {{ message.content }}
        </template>
        <template v-else>
          AI: <span v-html="message.content"></span>
        </template>
      </div>
    </div>

    <form @submit.prevent="sendMessage" class="d-flex">
      <input
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

<script>
export default {
  props: {
    sharedState: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chatInput: "", // To bind the input value
      messages: [], // To store chat messages
    };
  },
  computed: {
    linkedEntryIds() {
      return this.sharedState.linkedEntryIds;
    }
  },
  methods: {
    sendMessage() {
      if (!this.chatInput.trim()) return;

      // Add user's message to chat
      this.messages.push({ type: "user", content: this.chatInput });

      const userMessage = this.chatInput; // Store input locally
      this.chatInput = ""; // Clear input field

      // Send the message to the server
      fetch("/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": document.querySelector("[name='csrf-token']").content,
        },
        body: JSON.stringify({ message: userMessage, linkedEntryIds: this.sharedState.linkedEntryIds }),
      })
        .then((response) => response.json())
        .then((data) => {
          // Add AI response to chat
          this.messages.push({ type: "ai", content: data.message });
          this.scrollToBottom();
        })
        .catch((error) => console.error("Error:", error));
    },
    scrollToBottom() {
      const chatBox = this.$el.querySelector("#chat-box");
      chatBox.scrollTop = chatBox.scrollHeight;
    },
  },
  mounted() {
    console.log("sharedState InteractiveChat MOUNTED: " + this.sharedState)
    // Scroll to the bottom when the component is mounted
    this.scrollToBottom();
  },
};
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
