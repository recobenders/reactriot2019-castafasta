const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const Constants = require("../shared/constants");
const Player = require("./player");
const Queue = require("./queue");
const Spell = require("./spell");

//Port from environment variable or default - 4001
const port = process.env.PORT || 4001;

//Setting up express and adding socketIo middleware
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const queue = new Queue(io);

const incomingPlayers = [];

io.on("connection", socket => {
  socket.on(Constants.MSG.NEW_PLAYER, ({ uuid, name }) => {
    createAndQueuePlayer(uuid, name, socket);
  });

  socket.on(Constants.MSG.PREPARE_PLAYER, ({ uuid }) => {
    console.log(`New player incoming ${uuid}, waiting for mobile`);
    socket.uuid = uuid;
    incomingPlayers[uuid] = socket;
  });

  socket.on("disconnect", () => {
    if (socket.uuid) {
      removeConnectingPlayer(socket.uuid);
    }
    if (socket.player) {
      queue.removePlayer(socket.player);
      // TODO notify browser if socket.player.isQueued()
    }

    if (socket.game) {
      // resolve game disconnect
    }
    console.log("Client disconnected");
  });
});

function removeConnectingPlayer(uuid) {
  delete incomingPlayers[uuid];
}

function createAndQueuePlayer(uuid, name, socket) {
  console.log(`Mobile connected for player ${uuid}, adding to queue`);
  let browser_socket = incomingPlayers[uuid];
  if (!browser_socket) {
    socket.emit(Constants.MSG.ERROR, {
      message: "Browser connection is missing."
    });
    return;
  }
  let player = new Player(uuid, name, [browser_socket, socket]);
  queue.addPlayer(player);
  player.broadcast(Constants.MSG.WAITING_FOR_GAME);
  removeConnectingPlayer(uuid);
  console.log(player.serializeForUpdate());
}

setInterval(() => {
  console.log(`Incomming players: ${Object.keys(incomingPlayers).length}`);
}, 1000);

server.listen(port, () => console.log(`Listening on port ${port}`));
