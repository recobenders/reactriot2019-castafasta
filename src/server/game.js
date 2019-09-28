const Constants = require("../shared/constants");

class Game {
  constructor(id) {
    this.id = id;
    this.players = {};
    this.state = Constants.GAME_STATES.INIT;
    this.result = {};
  }

  addPlayer(player) {
    this.players[player.id] = player;
  }

  resolveWinner(type, winner) {
    this.result = {
      type: type,
      winner: winner
    };
    this.state = Constants.GAME_STATES.FINISHED;
  }
}

module.exports = Game;
