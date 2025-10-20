# ⚡ ByteFlame Backend

[![Node.js](https://img.shields.io/badge/Node.js-18.x-brightgreen?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.4+-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Hosted on AWS EC2](https://img.shields.io/badge/Hosted%20on-AWS%20EC2-orange?style=for-the-badge&logo=amazon-ec2)](https://aws.amazon.com/ec2/)
[![DNS by Cloudflare](https://img.shields.io/badge/DNS-Cloudflare-f38020?style=for-the-badge&logo=cloudflare)](https://www.cloudflare.com/)

A powerful **Node.js + Express.js** backend that powers the **ByteFlame** web application.  
Built for scalability, real-time chat, and modern authentication — hosted on **AWS EC2** and managed using **PM2**.

---

## 🌐 Live API Endpoint

👉 **[https://api.byteflame.in](https://api.byteflame.in)**  
(Behind **Cloudflare** + **Nginx Reverse Proxy**)

---

## 🚀 Tech Stack

**Backend**

- Node.js  
- Express.js  
- MongoDB + Mongoose  
- JWT (Authentication)  
- bcrypt (Password Hashing)  
- cookie-parser  
- Socket.io (Real-time chat)  
- AWS SES (Email Service)  
- PM2 (Process Manager)

**Infrastructure**

- AWS EC2 (Ubuntu 24.04 LTS)  
- Nginx (Reverse Proxy + SSL)  
- Cloudflare (DNS + HTTPS Proxy)

---

## 🧠 Features

* 🔐 Secure JWT Authentication with cookies  
* 💬 Real-time Chat (Socket.io)  
* 👥 Connection Requests & Friend Management  
* 🧾 Feed & Profile APIs  
* 📧 AWS SES Email Verification  
* 🧱 Modular Folder Structure  
* ☁️ Deployed on AWS EC2 with PM2 + Cloudflare SSL  

---

## 🧩 Folder Structure

```
ByteFlame_Backend/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── middleware/
│   │   └── auth.js
│   ├── model/
│   │   ├── user.js
│   │   ├── chat.js
│   │   └── connectionRequest.js
│   ├── router/
│   │   ├── auth.js
│   │   ├── chat.js
│   │   ├── profile.js
│   │   ├── requests.js
│   │   └── user.js
│   ├── utils/
│   │   ├── sendEmail.js
│   │   ├── sesClient.js
│   │   ├── socket.js
│   │   └── validation.js
│   └── app.js
│
├── .env
├── package.json
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/sachiinn05/ByteFlame_Backend.git
cd ByteFlame_Backend
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Add Environment Variables

Create a `.env` file in the project root:

```env
PORT=8080
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
```

### 4️⃣ Run the Server (Development)

```bash
npm run dev
```

👉 The server runs at  
**[http://localhost:9000](http://localhost:9000)**

---

## ☁️ Deployment (AWS EC2 + PM2)

This backend is deployed on **AWS EC2 (Ubuntu 24.04 LTS)** using **PM2** for process management and **Cloudflare** for DNS + SSL.

---

### 🖥️ 1. Connect to EC2 Instance

```bash
ssh -i "byteflame-secret.pem" ubuntu@ec2-13-51-48-171.eu-north-1.compute.amazonaws.com
```

---

### 📂 2. Navigate to Project Folder

```bash
cd ByteFlame_Backend
```

---

### 🔄 3. Pull Latest Code

```bash
git pull
```

---

### 📦 4. Install Dependencies

```bash
npm install
```

---

### ⚙️ 5. Manage App with PM2

#### Start the App (First Time)
```bash
pm2 start src/app.js --name ByteFlame_Backend
```

#### Check Status
```bash
pm2 list
```

#### Restart App
```bash
pm2 restart ByteFlame_Backend
```

#### View Logs
```bash
pm2 logs
```

#### Clear Logs
```bash
pm2 flush
```

---

### 🔁 6. Auto Restart on Reboot

```bash
pm2 startup
pm2 save
```

---

### 🌐 7. Configure Nginx (Optional but Recommended)

#### Install Nginx
```bash
sudo apt install nginx -y
```

#### Edit Nginx Config
```bash
sudo nano /etc/nginx/sites-available/default
```

#### Example Configuration
```nginx
server {
    listen 80;
    server_name api.byteflame.in;

    location / {
        proxy_pass http://localhost:9000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Restart Nginx
```bash
sudo systemctl restart nginx
```

---

### 🔐 8. Domain Setup via Cloudflare

1. Go to **Cloudflare DNS Settings**  
2. Add an **A record**  
   - Name: `api`  
   - Value: `your-ec2-public-ip`  
   - Proxy: **Enabled (orange cloud)**  
3. Set **SSL/TLS Mode → Full**  
4. Done ✅ — Your backend is now accessible via HTTPS.

---

## 🧩 Common PM2 Commands

| Command | Description |
|----------|-------------|
| `pm2 start src/app.js --name ByteFlame_Backend` | Start app |
| `pm2 restart ByteFlame_Backend` | Restart app |
| `pm2 list` | Check running processes |
| `pm2 logs` | View real-time logs |
| `pm2 flush` | Clear logs |
| `pm2 save` | Save current state |
| `pm2 startup` | Auto-start on reboot |

---

## 🧱 API Overview

| Endpoint | Method | Description |
|-----------|---------|-------------|
| `/api/auth/signup` | POST | Register new user |
| `/api/auth/login` | POST | Login user |
| `/api/user/profile` | GET | Get user profile |
| `/api/connection/send` | POST | Send connection request |
| `/api/chat/:userId` | GET | Fetch chat history |
| `/api/chat/send` | POST | Send chat message |

> 💡 All protected routes require a valid **JWT token** in cookies.

---

## 💻 Scripts

| Command | Description |
|----------|-------------|
| `npm run dev` | Start development server |
| `npm start` | Start production server |
| `pm2 list` | View all processes |
| `pm2 logs` | View logs |
| `pm2 restart ByteFlame_Backend` | Restart app |

---

## 📦 Dependencies

Main dependencies include:

- express  
- mongoose  
- jsonwebtoken  
- bcrypt  
- cookie-parser  
- cors  
- socket.io  
- dotenv  
- pm2  

---

## 🧑‍💻 Author

**Sachin Singh**  
🔗 [GitHub Profile](https://github.com/sachiinn05)  
💡 Hosted on **AWS EC2**, managed with **PM2**, and secured via **Cloudflare**.

---

## 📜 License

This project is licensed under the **MIT License**.
