<template>
  <div>
    <vue-advanced-chat
      :current-user-id="currentUserId"
      :rooms="JSON.stringify(rooms)"
      :rooms-loaded="true"
      :single-room="true"
      :messages="messages"
      :messages-loaded="messagesLoaded"
      @send-message="sendMessage($event.detail[0])"
      @fetch-messages="fetchMessages($event.detail[0])"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { register } from 'vue-advanced-chat';

// Register the chat component globally
register();

// Reactive data
const currentUserId = ref(window.currentUserId);
const rooms = ref([
  {
    roomId: '1',
    roomName: 'Journal AI',
    users: [
      { _id: window.currentUserId, username: 'You' },
      { _id: '0', username: 'AI Journal' },
    ],
  },
]);
const messages = ref([]);
const messagesLoaded = ref(false);

// Methods
const fetchMessages = ({ options = {} }) => {
  setTimeout(() => {
    if (options.reset) {
      messages.value = [];
      messagesLoaded.value = true;
    } else {
      messages.value = [...messages.value];
      messagesLoaded.value = true;
    }
  });
};

const sendMessage = (message) => {
  // Add the user's message
  messages.value = [
    ...messages.value,
    {
      _id: messages.value.length,
      content: message.content,
      senderId: currentUserId.value, // Set sender ID to the current user
      username: 'You',
      timestamp: new Date().toString().substring(16, 21),
      date: new Date().toDateString(),
    },
  ];

  // Send the message to the server
  fetch("/chats", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": document.querySelector("[name='csrf-token']").content,
    },
    body: JSON.stringify({ message: message.content }),
  })
    .then((response) => response.json())
    .then((data) => {
      // Add the AI response
      messages.value = [
        ...messages.value,
        {
          _id: messages.value.length,
          content: data.message,
          senderId: '0', // AI's sender ID
          username: 'AI Journal',
          timestamp: new Date().toString().substring(16, 21),
          date: new Date().toDateString(),
        },
      ];
    })
    .catch((error) => console.error("Error:", error));
};
</script>
