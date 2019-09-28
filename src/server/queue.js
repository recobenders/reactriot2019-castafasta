const Game = require("../server/game");
const Constants = require("../shared/constants");
const uuidv4 = require("uuid/v4");

class Queue {
  constructor(io) {
    this.waitingPlayers = [];
    this.io = io;
    setInterval(this.startNewGames.bind(this), Constants.QUEUE_CHECK_TIME);
  }

  addPlayer(player) {
    this.waitingPlayers.push(player);
  }

  isEnoughPlayers() {
    return this.waitingPlayers.length > 1;
  }

  removePlayer(player) {
    // TODO remove player from waiting players in case of disconnect
  }

  startNewGames() {
    console.log(`Queue: ${this.waitingPlayers.length} players`);

    while (this.isEnoughPlayers()) {
      let game = new Game(
        uuidv4(),
        this.io,
        this.waitingPlayers.pop(),
        this.waitingPlayers.pop()
      );
      console.log(`Creating new game ${game.id}`);
    }
  }
}

module.exports = Queue;
