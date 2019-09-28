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

const connectingWithMobilePlayers = [];

io.on("connection", socket => {
  console.log("New client connected");

  socket.on(Constants.MSG.NEW_PLAYER, ({ uuid, nickname }) => {
    // This should be called only from mobile
    console.log(`Mobile connected for player ${uuid}, adding to queue`);
    let browser_socket = connectingWithMobilePlayers[uuid];
    removeConnectingPlayer(uuid);
    let player = new Player(uuid, nickname, browser_socket, browser_socket);
    socket.uuid = uuid;
    socket.player = player;
    browser_socket.player = player;
    queue.addPlayer(player);
    console.log(player.serializeForUpdate());
  });

  socket.on(Constants.MSG.PREPARE_PLAYER, ({ uuid }) => {
    console.log(`Preparing player ${uuid}, waiting for mobile`);
    socket.uuid = uuid;
    connectingWithMobilePlayers[uuid] = socket;
  });

  // socket.on(ConstantsMSG);

  socket.on("disconnect", () => {
    if (socket.uuid) {
      removeConnectingPlayer(socket.uuid);
    }
    if (socket.player) {
      queue.removePlayer(socket.player);
    }
    console.log("Client disconnected");
  });
});

function removeConnectingPlayer(uuid) {
  delete connectingWithMobilePlayers[uuid];
}

setInterval(() => {
  console.log(
    `Connecting players: ${Object.keys(connectingWithMobilePlayers).length}`
  );
}, 1000);

server.listen(port, () => console.log(`Listening on port ${port}`));
