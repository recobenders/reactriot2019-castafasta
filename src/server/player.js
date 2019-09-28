const Constants = require("../shared/constants");
const Spell = require("../shared/spell");

class Player {
  constructor(id, username, sockets) {
    this.id = id;
    this.username = username;
    this.hp = Constants.PLAYER_MAX_HP;
    this.sockets = sockets;
    this.state = Constants.PLAYER_STATES.INIT;
    this.activeSpell = null;

    for (let socket of this.sockets) {
      socket.uuid = this.id;
      socket.player = this;
    }
  }

  takeDamage(damage) {
    this.hp -= damage;
  }

  selectSpell(spellKey) {
    this.activeSpell = Spell.getSpell(spellKey);
  }

  castSpell(accuracies) {
    let spell = this.activeSpell;
    this.activeSpell = null;
    spell.captureAccuracies(accuracies);
    spell.calculateDamage();
    return spell;
  }

  queueUp() {
    this.state = Constants.PLAYER_STATES.QUEUED;
  }

  isQueued() {
    return this.state === Constants.PLAYER_STATES.QUEUED;
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
      hp: this.hp,
      activeSpell: this.activeSpell
        ? this.activeSpell.serializeForUpdate()
        : null,
      state: this.state
    };
  }
}

module.exports = Player;
