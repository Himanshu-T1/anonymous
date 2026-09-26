<div align="center">

<img src="./assets/banner.svg" alt="Anonymous Room Chat banner" width="100%"/>

# 🛸 ANONYMOUS ROOM CHAT

### *A signal with no name. A room with no trace.*

![Node](https://img.shields.io/badge/Node.js-%3E%3D18-3c873a?style=for-the-badge&logo=node.js&logoColor=white)
![Socket.io](https://img.shields.io/badge/Realtime-Socket.io-black?style=for-the-badge&logo=socket.io&logoColor=white)
![Anonymous](https://img.shields.io/badge/Identity-None-8f7bff?style=for-the-badge)
![Deploy](https://img.shields.io/badge/Deploy-Render-46e3b7?style=for-the-badge&logo=render&logoColor=white)

</div>

---

## 📡 Transmission Overview

This is an anonymous, real-time chat app. No signup. No email. No identity.
You enter a **name** and a **password** — the password *is* the room.
Everyone who transmits the same password lands in the same room, instantly.

---

## ⚙️ Onboard Systems

| Module | Status |
|---|---|
| 🕶️ Fully anonymous — no signup / login / email | ✅ Online |
| 🏷️ Custom username, any name you like | ✅ Online |
| 🔑 Password = Room ID (same password → same room) | ✅ Online |
| 💬 Real-time messaging (Socket.io) | ✅ Online |
| 🖼️ Send images in chat (up to 5MB) | ✅ Online |
| 🔄 Change name mid-session, anytime | ✅ Online |
| 🚪 Exit room instantly | ✅ Online |
| 👥 Live list of who's online | ✅ Online |
| 🌍 Reachable from any location once deployed | ✅ Online |

---

## 🚀 Launch Sequence — Run Locally

```bash
npm install
npm start
```
Then open `http://localhost:3000` in your browser. Signal established.

---

## 🛰️ Deploy to Orbit — Push to GitHub

```bash
git init
git add .
git commit -m "Anonymous room chat app"
git branch -M main
git remote add origin <your-repo-URL>
git push -u origin main
```

---

## 🪐 Go Live — Deploy on Render

1. Go to [render.com](https://render.com), log in, click **New + → Web Service**
2. Select your GitHub repo
3. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node
4. Click **Deploy**. Within minutes, your ship gets a live URL — reachable from anywhere on Earth.

No extra configuration needed — Render handles the `PORT` variable automatically.

---

<div align="center">

*No names. No history. No trace. Just the signal.*

</div>
