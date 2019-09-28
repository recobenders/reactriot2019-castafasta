const Constants = require("../shared/constants");

class Game {
  constructor(id, player_one, player_two) {
    this.id = id;
    this.players = {};
    this.players[player_one.id] = player_one;
    this.players[player_two.id] = player_two;

    this.state = Constants.GAME_STATES.INIT;
    this.result = {};

    // Player sockets should join the same game room channel
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
