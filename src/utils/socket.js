const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../model/chat");
const ConnectionRequest = require("../model/connectionRequest");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("$"))
    .digest("hex");
};

const onlineUsers = new Map();

const addOnline = (userId, socketId) => {
  if (!userId) return false;
  const wasOffline = !onlineUsers.has(userId);
  if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
  onlineUsers.get(userId).add(socketId);
  return wasOffline;
};

const removeSocket = (socketId) => {
  for (const [userId, sockets] of onlineUsers.entries()) {
    if (!sockets.has(socketId)) continue;
    sockets.delete(socketId);
    if (sockets.size === 0) {
      onlineUsers.delete(userId);
      return userId;
    }
    return null;
  }
  return null;
};

const areFriends = async (userId, targetUserId) => {
  const connection = await ConnectionRequest.findOne({
    status: "accepted",
    $or: [
      { fromUserId: userId, toUserId: targetUserId },
      { fromUserId: targetUserId, toUserId: userId },
    ],
  });
  return Boolean(connection);
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });
  ioRef = io;

  io.on("connection", (socket) => {
    socket.on("presence:join", ({ userId }) => {
      if (!userId) return;
      socket.userId = String(userId);
      socket.join("user:" + socket.userId);
      const becameOnline = addOnline(socket.userId, socket.id);
      if (becameOnline) {
        io.emit("presence:update", { userId: socket.userId, online: true });
      }
      socket.emit("presence:list", {
        userIds: Array.from(onlineUsers.keys()),
      });
    });

    socket.on("joinChat", async ({ firstName, userId, targetUserId }) => {
      if (!userId || !targetUserId) return;
      const friends = await areFriends(userId, targetUserId);
      if (!friends) return;
      const roomId = getSecretRoomId(userId, targetUserId);
      socket.join(roomId);
      console.log((firstName || userId) + " joined Room : " + roomId);
    });

    socket.on("leaveChat", ({ userId, targetUserId }) => {
      if (!userId || !targetUserId) return;
      socket.leave(getSecretRoomId(userId, targetUserId));
    });

    socket.on("typing", ({ userId, targetUserId, isTyping }) => {
      if (!userId || !targetUserId) return;
      const roomId = getSecretRoomId(userId, targetUserId);
      socket.to(roomId).emit("typing", { userId, isTyping: Boolean(isTyping) });
    });

    socket.on("markRead", async ({ userId, targetUserId }) => {
      try {
        if (!userId || !targetUserId) return;
        const chat = await Chat.findOne({
          participants: { $all: [userId, targetUserId] },
        });
        if (!chat) return;
        if (!chat.unreadBy) chat.unreadBy = new Map();
        chat.unreadBy.set(String(userId), 0);
        await chat.save();
        io.to("user:" + String(userId)).emit("unread:update", {
          fromUserId: String(targetUserId),
          unreadCount: 0,
        });
      } catch (err) {
        console.log(err);
      }
    });

    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text }) => {
        try {
          if (!userId || !targetUserId || !text?.trim()) return;
          const friends = await areFriends(userId, targetUserId);
          if (!friends) return;

          const roomId = getSecretRoomId(userId, targetUserId);

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: userId,
            text: text.trim(),
          });

          if (!chat.unreadBy) chat.unreadBy = new Map();

          const room = io.sockets.adapter.rooms.get(roomId);
          const targetSockets = onlineUsers.get(String(targetUserId)) || new Set();
          const targetInRoom = [...targetSockets].some((sid) => room?.has(sid));

          if (!targetInRoom) {
            const key = String(targetUserId);
            chat.unreadBy.set(key, (chat.unreadBy.get(key) || 0) + 1);
          }

          await chat.save();

          io.to(roomId).emit("messageReceived", {
            firstName,
            lastName,
            text: text.trim(),
            senderId: userId,
          });

          if (!targetInRoom) {
            io.to("user:" + String(targetUserId)).emit("unread:update", {
              fromUserId: String(userId),
              unreadCount: chat.unreadBy.get(String(targetUserId)) || 1,
            });
          }
        } catch (err) {
          console.log(err);
        }
      }
    );

    socket.on("disconnect", () => {
      const offlineUserId = removeSocket(socket.id);
      if (offlineUserId) {
        io.emit("presence:update", { userId: offlineUserId, online: false });
      }
    });
  });
};

let ioRef = null;

const notifyRelationshipEnded = (userIdA, userIdB) => {
  if (!ioRef) return;
  ioRef.to("user:" + userIdA).emit("relationship:ended", { userId: String(userIdB) });
  ioRef.to("user:" + userIdB).emit("relationship:ended", { userId: String(userIdA) });
};

initializeSocket.notifyRelationshipEnded = notifyRelationshipEnded;
module.exports = initializeSocket;
module.exports.notifyRelationshipEnded = notifyRelationshipEnded;
