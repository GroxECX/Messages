const socket = io();

const messagesDiv = document.getElementById('messages');
const chatForm = document.getElementById('chat-form');
const input = document.getElementById('input');
const userInput = document.getElementById('user');

function addMessage(msg) {
  const div = document.createElement('div');
  div.className = 'message';
  div.innerHTML = `<span class="user">${escapeHtml(msg.user)}</span>
                   <span class="time">${new Date(msg.time).toLocaleTimeString()}</span>
                   <div>${escapeHtml(msg.text)}</div>`;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Receive initial messages
socket.on('init', (msgs) => {
  messagesDiv.innerHTML = '';
  msgs.forEach(addMessage);
});

// Receive new message
socket.on('message', addMessage);

// Send message
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value && userInput.value) {
    socket.emit('message', { user: userInput.value, text: input.value });
    input.value = '';
  }
});
