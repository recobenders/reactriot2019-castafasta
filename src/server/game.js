const Constants = require("../shared/constants");

class Game {
  constructor() {
    this.sockets = {};
    this.players = {};
    // Constants.PLAYER_HP;
  }

  addPlayer(socket, username) {
    this.sockets[socket.id] = socket;
  }
}
