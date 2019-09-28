const Constants = require("../shared/constants");
const Spell = require("../shared/spell");

class Game {
  constructor(id, io, player_one, player_two) {
    this.id = id;
    this.io = io;
    this.channelName = `game${this.id}`;

    this.players = {};
    this.playerOne = player_one;
    this.playerTwo = player_two;

    this.state = Constants.GAME_STATES.INIT;
    this.result = {};

    this.playerOne.joinGame(this);
    this.playerTwo.joinGame(this);

    this.broadcast(Constants.MSG.GAME_JOINED, this.serializeForUpdate());
    setInterval(this.update.bind(this), Constants.QUEUE_CHECK_TIME);
  }

  update() {
    console.log(`Game #${this.id} sending update`);
    this.broadcast(Constants.MSG.GAME_UPDATE, this.serializeForUpdate());
  }

  broadcast(type, data) {
    this.io.sockets.in(this.channelName).emit(type, data);
  }

  resolveWinner(type, winner) {
    this.result = {
      type: type,
      winner: winner
    };
    this.state = Constants.GAME_STATES.FINISHED;
  }

  getOpponent(player) {
    return this.playerOne.id === player.id ? this.playerTwo : this.playerOne;
  }

  updatePlayer(player) {
    if (this.playerOne.id === player.id) {
      this.playerOne = player;
    } else {
      this.playerTwo = player;
    }
  }

  spellCastedFromPlayer(player, accuracies) {
    // Retrieve and remove active spell from player
    let spell = Spell.getSpell("fireball");
    spell.captureAccuracies(accuracies);
    let dmg = spell.calculateDamage();
    console.log(dmg);
    console.log(accuracies);

    if (dmg === undefined) return;

    let opponent = this.getOpponent(player);
    opponent.takeDamage(dmg);
    console.log(`Game#${this.id}: Resolving ${dmg} to player ${opponent.id}`);
    this.updatePlayer(opponent);
  }

  serializeForUpdate() {
    return {
      gameId: this.id,
      playerOne: this.playerOne.serializeForUpdate(),
      playerTwo: this.playerTwo.serializeForUpdate()
    };
  }
}

module.exports = Game;
