const Constants = require("../shared/constants");

class Game {
  constructor() {
    this.sockets = {};
    this.players = {};
  }

  addPlayer(socket, username) {
    this.sockets[socket.id] = socket;
  }
}

module.exports = Game;
