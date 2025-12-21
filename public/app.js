const socket = io();

const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const chatBox = document.getElementById('chat-box');

const username = prompt('Enter your name:');
socket.emit('new-user', username);

sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
  const msg = messageInput.value.trim();
  if (msg !== '') {
    socket.emit('chat-message', msg);
    messageInput.value = '';
  }
}

socket.on('message', (data) => {
  const msgDiv = document.createElement('div');
  msgDiv.textContent = data;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
});