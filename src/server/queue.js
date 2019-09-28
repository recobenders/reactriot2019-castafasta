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
    player.queueUp();
  }

  isEnoughPlayers() {
    return this.waitingPlayers.length > 1;
  }

  removePlayer(player) {
    let i = this.waitingPlayers.indexOf(player);

    if (i == null) {
      console.log('Player is not present in the queue');
      return;
    }

    this.waitingPlayers.splice(i, 1);
    console.log('Player has been removed from queue');
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
