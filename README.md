# ByteFlame Backend

REST + Socket.io API for ByteFlame (dating / interest matching).

[![Live API](https://img.shields.io/badge/Live-API-brightgreen)](https://byteflame-backend.onrender.com)
[![Backend](https://img.shields.io/badge/GitHub-Backend-181717?logo=github)](https://github.com/sachiinn05/dev_tinder)
[![Frontend](https://img.shields.io/badge/GitHub-Frontend-181717?logo=github)](https://github.com/sachiinn05/devTinderUI)

## Live links

| | URL |
|---|---|
| **API** | [https://byteflame-backend.onrender.com](https://byteflame-backend.onrender.com) |
| **App** | [https://byte-flame-ui-ux.vercel.app](https://byte-flame-ui-ux.vercel.app) |
| **Backend repo** | [github.com/sachiinn05/dev_tinder](https://github.com/sachiinn05/dev_tinder) |
| **Frontend repo** | [github.com/sachiinn05/devTinderUI](https://github.com/sachiinn05/devTinderUI) |

Health check: open the API URL — you should see `ByteFlame API is running`.

> Free Render sleeps after inactivity. The first request can take ~1 minute.

## Features

- JWT auth (httpOnly cookies)
- Profile view/edit + photo upload (`/uploads`)
- Interest-based feed (match %, filters, pagination)
- Connection requests (interested / ignore / accept / reject)
- Unmatch and block
- Real-time chat: messages, presence, typing, unread
- CORS for localhost + Vercel

## Tech stack

Node.js · Express.js · MongoDB / Mongoose · JWT · bcrypt · Socket.io · Multer · Render · MongoDB Atlas

## Local setup

```bash
git clone https://github.com/sachiinn05/dev_tinder.git
cd dev_tinder
npm install
```

Create `.env`:

```env
DB_CONNECTION_STRING=your_mongodb_atlas_uri
JWT_SECRET=your_secret
NODE_ENV=development
FRONTEND_ORIGIN=http://localhost:5173
```

```bash
npm run dev
```

Server: [http://localhost:9000](http://localhost:9000)

## Main APIs

| Method | Path | Description |
|--------|------|-------------|
| POST | `/signup` | Register |
| POST | `/login` | Login |
| POST | `/logout` | Logout |
| GET | `/profile/view` | Current user |
| PATCH | `/profile/editi` | Edit profile |
| POST | `/profile/photo` | Upload photo |
| GET | `/feed` | Ranked feed (`page`, `interest`, `gender`, `minAge`, `maxAge`) |
| POST | `/request/send/:status/:userId` | interested / ignore |
| POST | `/request/review/:status/:requestId` | accepted / rejected |
| POST | `/request/unmatch/:userId` | Unmatch |
| POST | `/request/block/:userId` | Block |
| GET | `/user/connections` | Matches |
| GET | `/user/request/received` | Incoming requests |
| GET | `/chat/:targetUserId` | Chat history |

Protected routes need the JWT cookie (`withCredentials: true`).

## Production (Render)

Start command: `npm start`

Environment:

```env
DB_CONNECTION_STRING=your_mongodb_atlas_uri
JWT_SECRET=your_secret
NODE_ENV=production
FRONTEND_ORIGIN=https://byte-flame-ui-ux.vercel.app
```

Do not set `PORT` — Render provides it.

## Author

**Sachin Singh**  
[GitHub](https://github.com/sachiinn05)
