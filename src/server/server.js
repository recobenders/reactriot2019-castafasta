const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const Constants = require("../shared/constants");
const Player = require("./player");
const Queue = require("./queue");

//Port from environment variable or default - 4001
const port = process.env.PORT || 4001;

//Setting up express and adding socketIo middleware
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const queue = new Queue(io);

io.on("connection", socket => {
  console.log("New client connected");

  socket.on(Constants.MSG.NEW_PLAYER, nickname => {
    // Temporarly using socket.id
    let player = new Player(socket.id, nickname, socket);
    queue.addPlayer(player);
    console.log(player.serializeForUpdate());
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    // TODO remove player from queue
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
