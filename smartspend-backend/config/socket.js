const { Server } = require("socket.io");

let io;
const onlineUsers = new Map(); 

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`.bgMagenta.white);

    socket.on("register", (userId) => {
      if (userId) onlineUsers.set(userId.toString(), socket.id);
    });

    socket.on("disconnect", () => {
      for (const [userId, sockId] of onlineUsers.entries()) {
        if (sockId === socket.id) onlineUsers.delete(userId);
      }
      console.log(`Socket disconnected: ${socket.id}`.bgMagenta.white);
    });
  });

  return io;
};

const emitToUser = (userId, event, data) => {
  if (!userId || !io) return;
  const socketId = onlineUsers.get(userId.toString());
  if (socketId) io.to(socketId).emit(event, data);
};

const broadcast = (event, data) => {
  if (io) io.emit(event, data);
};

const getIO = () => io;

module.exports = { initSocket, emitToUser, broadcast, getIO };
