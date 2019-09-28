const Constants = require("../shared/constants");
const Spell = require("../shared/spell");

class Game {
  constructor(id, io, player_one, player_two) {
    this.id = id;
    this.io = io;
    this.channelName = `game${this.id}`;

    this.playerOne = player_one;
    this.playerTwo = player_two;

    this.state = Constants.GAME_STATES.INIT;
    this.result = {};
    this.resolutionSent = false;
    this.endAt = Date.now() + (Constants.ROUND_SECONDS * 1000);

    this.playerOne.joinGame(this);
    this.playerTwo.joinGame(this);

    this.broadcast(Constants.MSG.GAME_JOINED, this.serializeForUpdate());
    this.updateIntervalId = setInterval(this.update.bind(this), Constants.QUEUE_CHECK_TIME);
  }

  update() {
    if (this.isFinished()) {
      if (this.resolutionSent) return;

      this.resolve();
      this.resolutionSent = true;
    }

    console.log(`Game #${this.id} sending update`);
    this.broadcast(Constants.MSG.GAME_UPDATE, this.serializeForUpdate());
  }

  isFinished() {
    return this.playerOne.hp <= 0 || this.playerTwo.hp <= 0 || this.endAt < Date.now()
  }

  broadcast(type, data) {
    this.io.sockets.in(this.channelName).emit(type, data);
  }

  resolve() {
    if (this.endAt < Date.now()) {
      this.result = {
        type: Constants.RESOLUTION_TYPES.DRAW,
        winner: null
      };
    } else {
      const winner = this.playerOne.hp <= 0 ? this.playerTwo : this.playerOne;
      this.result = {
        type: Constants.RESOLUTION_TYPES.VICTORY,
        winner: winner
      };
    }

    this.state = Constants.GAME_STATES.FINISHED;
    clearInterval(this.updateIntervalId);
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

  spellSelectedByPlayer(player, spellKey) {
    console.log(`Game#${this.id}: Player ${player.id} selected ${spellKey}`);
    player.selectSpell(spellKey);
    this.updatePlayer(player);
    this.update();
  }

  spellCastedbyPlayer(player, accuracies) {
    let spell = player.castSpell(accuracies);
    if (spell.dmg === undefined) return;

    let opponent = this.getOpponent(player);
    opponent.takeDamage(spell.dmg);
    console.log(
      `Game#${this.id}: Dealing ${spell.dmg} dmg to player ${opponent.id}`
    );
    this.updatePlayer(opponent);
    this.update();
  }

  serializeForUpdate() {
    return {
      gameId: this.id,
      state: this.state,
      result: this.result,
      playerOne: this.playerOne.serializeForUpdate(),
      playerTwo: this.playerTwo.serializeForUpdate()
    };
  }
}

module.exports = Game;
