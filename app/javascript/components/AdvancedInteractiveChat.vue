<template>
  <div>
    <vue-advanced-chat
      :current-user-id="currentUserId"
      :rooms="JSON.stringify(rooms)"
      :rooms-loaded="true"
      :single-room="true"
      :messages="JSON.stringify(messages)"
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
    // Uncomment the following to simulate adding a new message
    // addNewMessage();
  });
};

const sendMessage = (message) => {
  messages.value = [
    ...messages.value,
    {
      _id: messages.value.length,
      content: message.content,
      senderId: currentUserId.value,
      timestamp: new Date().toString().substring(16, 21),
      date: new Date().toDateString(),
    },
  ];
};

const addNewMessage = () => {
  setTimeout(() => {
    messages.value = [
      ...messages.value,
      {
        _id: messages.value.length,
        content: 'NEW MESSAGE',
        senderId: '1234',
        timestamp: new Date().toString().substring(16, 21),
        date: new Date().toDateString(),
      },
    ];
  }, 2000);
};
</script>
