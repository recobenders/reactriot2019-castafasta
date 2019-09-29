const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const Constants = require("../shared/constants");
const Player = require("./player");
const Queue = require("./queue");
const Game = require("../server/game");
const uuidv4 = require("uuid/v4");

//Port from environment variable or default - 4001
const port = process.env.SOCKET_PORT || 4001;

//Setting up express and adding socketIo middleware
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const queue = new Queue(io);

const incomingPlayers = [];

io.on("connection", socket => {
  socket.on(Constants.MSG.NEW_PLAYER, ({ uuid, name, singlePlayer }) => {
    let player = createPlayer(uuid, name, socket);
    broadcastWaitAndHandleStart(io, player, queue, singlePlayer);
  });

  socket.on(Constants.MSG.PREPARE_PLAYER, ({ uuid }) => {
    console.log(`New player incoming ${uuid}, waiting for mobile`);
    socket.uuid = uuid;
    incomingPlayers[uuid] = socket;
  });

  socket.on(Constants.MSG.SPELL_SELECTED, spellKey => {
    socket.game.spellSelectedByPlayer(socket.player, spellKey);
  });

  socket.on(Constants.MSG.CASTING_DONE, spellAccuracies => {
    socket.game.spellCastedbyPlayer(socket.player, spellAccuracies);
  });

  socket.on(Constants.MSG.ANOTHER_GAME, ({ singlePlayer }) => {
    let player = socket.player;
    player = new Player(player.id, player.username, player.sockets, false);
    broadcastWaitAndHandleStart(io, player, queue, singlePlayer);
  });

  socket.on("disconnect", () => {
    if (socket.uuid) {
      removeConnectingPlayer(socket.uuid);
    }
    if (socket.player) {
      queue.removePlayer(socket.player);
      if (socket.player.isQueued()) {
        // TODO: Change PLAYER_LEFT_QUEUE to CONTROLLER_DISCONNECTED
        socket.player.broadcast(Constants.MSG.PLAYER_LEFT_QUEUE);
      }
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

function createPlayer(uuid, name, socket) {
  console.log(`Mobile connected for player ${uuid}, adding to queue`);
  let browser_socket = incomingPlayers[uuid];
  if (!browser_socket) {
    socket.emit(Constants.MSG.ERROR, {
      message: "Browser connection is missing."
    });
    return;
  }
  removeConnectingPlayer(uuid);
  return new Player(uuid, name, [browser_socket, socket], false);
}

function queuePlayer(queue, player) {
  queue.addPlayer(player);
}

function startGameWithBot(io, player) {
  let botPlayer = new Player(uuidv4(), "Bot Mage", [], true);
  new Game(uuidv4(), io, player, botPlayer);
}

function broadcastWaitAndHandleStart(io, player, queue, singlePlayer) {
  player.broadcast(Constants.MSG.WAITING_FOR_GAME);

  if (singlePlayer) {
    startGameWithBot(io, player);
  } else {
    queuePlayer(queue, player);
  }
}

setInterval(() => {
  console.log(`Incomming players: ${Object.keys(incomingPlayers).length}`);
}, 1000);

server.listen(port, () => console.log(`Listening on port ${port}`));
