const Constants = require("../shared/constants");

class Player {
  constructor(id, username, sockets) {
    this.id = id;
    this.username = username;
    this.hp = Constants.PLAYER_MAX_HP;
    this.sockets = sockets;

    for (let socket of this.sockets) {
      socket.uuid = this.id;
      socket.player = this;
    }
  }

  takeDamage(damage) {
    this.hp -= damage;
  }

  joinGame(game) {
    for (let socket of this.sockets) {
      socket.join(game.channelName);
      socket.game = game;
    }
  }

  broadcast(type, data) {
    for (let socket of this.sockets) {
      socket.emit(type, data);
    }
  }

  serializeForUpdate() {
    return {
      id: this.id,
      username: this.username,
      hp: this.hp
    };
  }
}

module.exports = Player;
