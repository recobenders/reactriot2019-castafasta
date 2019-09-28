const Constants = require("../shared/constants");

class Game {
  constructor(id, io, player_one, player_two) {
    this.id = id;
    this.io = io;
    this.channel_name = `game${this.id}`;

    this.players = {};
    this.players[player_one.id] = player_one;
    this.players[player_two.id] = player_two;

    this.state = Constants.GAME_STATES.INIT;
    this.result = {};

    for (let playerId of Object.keys(this.players)) {
      this.players[playerId].joinGame(this);
    }

    this.broadcast(Constants.MSG.GAME_JOINED);
    setInterval(this.update.bind(this), Constants.QUEUE_CHECK_TIME);
  }

  update() {
    console.log(`Game #${this.id} sending update`);
    this.broadcast(Constants.MSG.GAME_UPDATE, this.serializeForUpdate());
  }

  broadcast(type, data) {
    this.io.sockets.in(this.channel_name).emit(type, data);
  }

  resolveWinner(type, winner) {
    this.result = {
      type: type,
      winner: winner
    };
    this.state = Constants.GAME_STATES.FINISHED;
  }

  serializeForUpdate() {
    return {
      id: this.id
    };
  }
}

module.exports = Game;
