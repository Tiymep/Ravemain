const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public")); // папка для фронтенда

let videoState = {
  videoId: "dQw4w9WgXcQ", // любое YouTube-видео по умолчанию
  time: 0,
  isPlaying: false
};

io.on("connection", (socket) => {
  console.log("Новый пользователь подключился");

  // Отправляем текущее состояние новому клиенту
  socket.emit("init", videoState);

  // Когда кто-то управляет видео
  socket.on("videoAction", (state) => {
    videoState = state;
    socket.broadcast.emit("videoAction", state);
  });

  // Чат
  socket.on("chatMessage", (msg) => {
    io.emit("chatMessage", msg);
  });

  socket.on("disconnect", () => {
    console.log("Пользователь отключился");
  });
});

server.listen(3000, () => {
  console.log("Сервер запущен на http://localhost:3000");
});
