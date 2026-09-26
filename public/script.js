
const socket = io();

const loginScreen = document.getElementById('loginScreen');
const chatScreen = document.getElementById('chatScreen');
const usernameInput = document.getElementById('usernameInput');
const passwordInput = document.getElementById('passwordInput');
const joinBtn = document.getElementById('joinBtn');
const loginError = document.getElementById('loginError');

const roomLabel = document.getElementById('roomLabel');
const messagesDiv = document.getElementById('messages');
const userListEl = document.getElementById('userList');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const imageBtn = document.getElementById('imageBtn');
const imageFileInput = document.getElementById('imageFileInput');
const imagePreviewBar = document.getElementById('imagePreviewBar');
const imagePreviewThumb = document.getElementById('imagePreviewThumb');
const cancelImageBtn = document.getElementById('cancelImageBtn');

let pendingImageData = null;
const MAX_IMAGE_MB = 5;
const exitBtn = document.getElementById('exitBtn');
const changeNameBtn = document.getElementById('changeNameBtn');

const nameModal = document.getElementById('nameModal');
const newNameInput = document.getElementById('newNameInput');
const saveNameBtn = document.getElementById('saveNameBtn');
const cancelNameBtn = document.getElementById('cancelNameBtn');

let myUsername = '';
let myRoom = '';

joinBtn.addEventListener('click', joinRoom);
[usernameInput, passwordInput].forEach(inp =>
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') joinRoom(); })
);

function joinRoom() {
  const username = usernameInput.value.trim();
  const room = passwordInput.value.trim();
  if (!username || !room) {
    loginError.textContent = 'Username और password दोनों डालो';
    return;
  }
  myUsername = username;
  myRoom = room;
  socket.emit('join', { room, username });
}

socket.on('joined', ({ room }) => {
  loginScreen.classList.add('hidden');
  chatScreen.classList.remove('hidden');
  roomLabel.textContent = `Room: ${room}`;
  messagesDiv.innerHTML = '';
});

socket.on('chatMessage', ({ username, text, time }) => {
  const div = document.createElement('div');
  div.className = 'msg' + (username === myUsername ? ' own' : '');
  div.innerHTML = `<div class="name">${escapeHtml(username)}</div><div class="text">${escapeHtml(text)}</div><div class="time">${time}</div>`;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

socket.on('system', (text) => {
  const div = document.createElement('div');
  div.className = 'system-msg';
  div.textContent = text;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

socket.on('userList', (users) => {
  userListEl.innerHTML = '';
  users.forEach(u => {
    const li = document.createElement('li');
    li.textContent = u;
    userListEl.appendChild(li);
  });
});

socket.on('imageMessage', ({ username, image, time }) => {
  const div = document.createElement('div');
  div.className = 'msg' + (username === myUsername ? ' own' : '');
  div.innerHTML = `<div class="name">${escapeHtml(username)}</div><img class="chat-image" src="${image}" alt="image"><div class="time">${time}</div>`;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

function sendMessage() {
  if (pendingImageData) {
    socket.emit('imageMessage', pendingImageData);
    clearPendingImage();
    return;
  }
  const text = messageInput.value.trim();
  if (!text) return;
  socket.emit('chatMessage', text);
  messageInput.value = '';
}

sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });

imageBtn.addEventListener('click', () => imageFileInput.click());

imageFileInput.addEventListener('change', () => {
  const file = imageFileInput.files[0];
  if (!file) return;
  if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
    alert(`Image ${MAX_IMAGE_MB}MB से छोटी होनी चाहिए`);
    imageFileInput.value = '';
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    pendingImageData = reader.result;
    imagePreviewThumb.src = pendingImageData;
    imagePreviewBar.classList.remove('hidden');
  };
  reader.readAsDataURL(file);
});

cancelImageBtn.addEventListener('click', clearPendingImage);

function clearPendingImage() {
  pendingImageData = null;
  imageFileInput.value = '';
  imagePreviewBar.classList.add('hidden');
}

exitBtn.addEventListener('click', () => {
  socket.emit('leaveRoom');
  chatScreen.classList.add('hidden');
  loginScreen.classList.remove('hidden');
  usernameInput.value = '';
  passwordInput.value = '';
  loginError.textContent = '';
});

changeNameBtn.addEventListener('click', () => {
  newNameInput.value = myUsername;
  nameModal.classList.remove('hidden');
});

cancelNameBtn.addEventListener('click', () => nameModal.classList.add('hidden'));

saveNameBtn.addEventListener('click', () => {
  const newName = newNameInput.value.trim();
  if (!newName) return;
  socket.emit('changeName', newName);
  myUsername = newName;
  nameModal.classList.add('hidden');
});

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
