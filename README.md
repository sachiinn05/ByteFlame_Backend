# 🚀 ByteFlame Backend

ByteFlame Backend is a RESTful API built using **Node.js** and **Express.js**, designed to handle authentication, user management, chats, and connection requests for a dating-style application.

---

## 🧰 Tech Stack

- **Node.js** — JavaScript runtime environment  
- **Express.js** — Web framework for routing and middleware  
- **MongoDB + Mongoose** — NoSQL database and ODM  
- **JWT (jsonwebtoken)** — Authentication using tokens  
- **bcrypt** — Password hashing  
- **cookie-parser** — Handle cookies for JWT tokens  
- **Socket.IO** — Real-time communication (chat, notifications)  
- **AWS EC2** — Hosting backend  
- **Cloudflare** — DNS and domain management  
- **PM2** — Process manager for production deployment

---

## 📁 Project Structure

```
ByteFlame_Backend/
│
├── src/
│   ├── config/
│   │   └── database.js        # MongoDB connection setup
│   │
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   │
│   ├── model/
│   │   ├── user.js            # User schema
│   │   ├── chat.js            # Chat schema
│   │   └── connectionRequest.js
│   │
│   ├── router/
│   │   ├── auth.js
│   │   ├── chat.js
│   │   ├── profile.js
│   │   ├── requests.js
│   │   └── user.js
│   │
│   ├── utils/
│   │   ├── sendEmail.js
│   │   ├── sesClient.js
│   │   ├── socket.js
│   │   └── validation.js
│   │
│   └── app.js                 # Express app entry point
│
├── .env                       # Environment variables
├── package.json
├── .gitignore
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/ByteFlame_Backend.git
cd ByteFlame_Backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
PORT=5173
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
```

### 4. Run the server (development)

```bash
npm run dev
```

### 5. Run the server (production)

```bash
npm start
```

---

## 🧠 Authentication Middleware

`src/middleware/auth.js` handles token verification using **JWT**



## ☁️ Deployment (AWS EC2 + PM2)

This backend is hosted on **AWS EC2 (Ubuntu 24.04 LTS)** and managed using **PM2** for process monitoring. **Cloudflare** is used for DNS and domain management.

---

### 🖥️ 1. Connect to your EC2 instance

Use your `.pem` key to SSH into the EC2 server:

```bash
ssh -i "C:\Users\asus\Downloads\byteflame-secret.pem" ubuntu@ec2-13-51-48-171.eu-north-1.compute.amazonaws.com
```

---

### 📂 2. Navigate to your backend directory

```bash
cd ByteFlame_Backend
```

---

### 🔄 3. Pull the latest code from GitHub

```bash
git pull
```

---

### 📦 4. Install dependencies

```bash
npm install
```

---

### ⚙️ 5. Manage the app with PM2

#### Start the app (first time)
```bash
pm2 start src/app.js --name ByteFlame_Backend
```

#### Check running processes
```bash
pm2 list
```

Expected output:
```
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ ByteFlame_Backend  │ fork     │ 18   │ online    │ 0%       │ 16.9mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
```

#### Restart the app
```bash
pm2 restart ByteFlame_Backend
```

If you’ve updated environment variables:
```bash
pm2 restart ByteFlame_Backend --update-env
```

#### View live logs
```bash
pm2 logs
```

#### Flush logs
```bash
pm2 flush
```

---

### 🧠 6. Auto-start PM2 on reboot

To make sure your backend restarts automatically after server reboot:

```bash
pm2 startup
pm2 save
```

---

### 🌐 7. Domain & DNS (Cloudflare)

- **Hosting:** AWS EC2 (Ubuntu 24.04 LTS)  
- **DNS:** Cloudflare  
- **Domain Example:** `https://api.yourdomain.com`  
- Cloudflare proxies requests to your EC2 public IP.  
- Use Nginx (optional) as a reverse proxy to serve your Node.js app on port 80 or 443 with SSL.

---

## 🧩 Scripts

| Command | Description |
|----------|--------------|
| `npm start` | Run app in production |
| `npm run dev` | Run app in development (nodemon) |
| `pm2 list` | Show running PM2 processes |
| `pm2 logs` | View logs |
| `pm2 restart ByteFlame_Backend` | Restart the backend |
| `pm2 flush` | Clear logs |

---

## 📦 Dependencies

Main dependencies listed in `package.json`:

- express  
- mongoose  
- jsonwebtoken  
- bcrypt  
- cors  
- cookie-parser  
- dotenv  
- socket.io  
- pm2  

---

## 🛡️ License

This project is licensed under the **ISC License**.

---

## 👨‍💻 Author

Developed by **ByteFlame Team** 🔥  
Hosted on **AWS EC2**, managed with **PM2**, and secured via **Cloudflare DNS**.  
Maintained and deployed manually using SSH and Git.

---
