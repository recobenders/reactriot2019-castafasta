const Constants = require("../shared/constants");
const Spell = require("./spell");

class Player {
  constructor(id, username, sockets, bot) {
    this.id = id;
    this.username = username;
    this.hp = Constants.PLAYER_MAX_HP;
    this.sockets = sockets;
    this.state = Constants.PLAYER_STATES.INIT;
    this.activeSpell = null;
    this.bot = bot;

    for (let socket of this.sockets) {
      socket.uuid = this.id;
      socket.player = this;
    }
  }

  takeDamage(damage) {
    this.hp -= damage;
    if (this.hp < 0) {
      this.hp = 0;
    }
  }

  isBot() {
    return this.isBot;
  }

  availableSpells() {
    return Spell.getSpells();
  }

  selectSpell(spellKey) {
    this.activeSpell = Spell.getSpell(spellKey);
  }

  processSpellStep(weight, capturedCode) {
    if (this.activeSpell) return null;

    if (this.activeSpell.currentRequiredSequence !== capturedCode) {
      return null;
    }
    this.activeSpell.captureAccuracy(weight);
    return this.activeSpell;
  }

  castSpell() {
    let spell = this.activeSpell;
    this.activeSpell = null;
    if (spell) {
      spell.calculateDamage();
    }
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

  generateRandomAccuracies() {
    return this.activeSpell.requiredSequences.map(el => {
      return Math.random();
    });
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
