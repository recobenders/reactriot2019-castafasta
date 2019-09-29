const Constants = require("../shared/constants");
const Spell = require("../shared/spell");

class Game {
  constructor(id, io, player_one, player_two) {
    this.id = id;
    this.io = io;
    this.channelName = `game${this.id}`;

    this.playerOne = player_one;
    this.playerTwo = player_two;

    this.bot = null;
    if (this.playerOne.isBot()) {
      this.bot = this.playerOne;
    }
    if (this.playerTwo.isBot()) {
      this.bot = this.playerTwo;
    }

    this.state = Constants.GAME_STATES.INIT;
    this.result = {};
    this.resolutionSent = false;

    this.roundTime = Constants.ROUND_SECONDS;

    this.playerOne.joinGame(this);
    this.playerTwo.joinGame(this);

    this.broadcast(Constants.MSG.GAME_JOINED, this.serializeForUpdate());
    this.updateIntervalId = setInterval(
      this.updateTimer.bind(this),
      Constants.GAME_TICK
    );
  }

  updateTimer() {
    this.roundTime -= 1;
    this.update();
  }

  update() {
    if (this.isFinished()) {
      if (this.resolutionSent) return;

      this.resolve();
      this.resolutionSent = true;
    } else {
      if (this.bot !== null && this.bot.activeSpell === null) {
        if (Math.random() >= 1 - Constants.BOT_CHANCE_TO_CAST) {
          this.scheduleBotSpell();
        }
      }
    }

    console.log(`Game #${this.id} sending update`);
    this.broadcast(Constants.MSG.GAME_UPDATE, this.serializeForUpdate());
  }

  scheduleBotSpell() {
    if (!this.bot.isBot()) return;

    const availableSpells = Object.keys(this.bot.availableSpells());
    this.bot.activeSpell = this.bot.availableSpells()[
      availableSpells[Math.floor(Math.random() * availableSpells.length)]
    ];

    this.spellSelectedByPlayer(
      this.bot,
      this.bot.activeSpell.name.toLocaleLowerCase()
    );

    let spellTimeout = this.bot.activeSpell.requiredSequences.length * 1000;

    let futureSpellCast = new Promise((resolve, reject) => {
      setTimeout(resolve, spellTimeout);
    });

    futureSpellCast.then(() => {
      if (!this.isFinished()) {
        this.spellCastedbyPlayer(this.bot, this.bot.generateRandomAccuracies());
        console.log("Bot cast spell.");
      }
    });
  }

  isFinished() {
    return this.playerOne.hp <= 0 || this.playerTwo.hp <= 0 || this.timeIsOut();
  }

  timeIsOut() {
    return this.roundTime <= 0;
  }

  broadcast(type, data) {
    this.io.sockets.in(this.channelName).emit(type, data);
  }

  resolve() {
    if (this.timeIsOut()) {
      console.log(`Game #${this.id}: draw!`);
      this.result = {
        type: Constants.RESOLUTION_TYPES.DRAW,
        winner: null
      };
    } else {
      const winner = this.playerOne.hp <= 0 ? this.playerTwo : this.playerOne;
      this.animateEvent(winner, "Won");
      console.log(`Game #${this.id}: winner is ${winner.username}`);
      this.result = {
        type: Constants.RESOLUTION_TYPES.VICTORY,
        winner: winner.serializeForUpdate()
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
    console.log(
      `Game#${this.id}: Player ${player.username} selected ${spellKey}`
    );
    player.selectSpell(spellKey);
    this.animateEvent(player, "Conjuring");

    this.updatePlayer(player);
    this.update();
  }

  spellCastedbyPlayer(player, accuracies) {
    let spell = player.castSpell(accuracies);
    if (spell == null || spell.dmg === undefined) return;

    this.animateEvent(player, "Attacking", spell.key);

    let opponent = this.getOpponent(player);
    opponent.takeDamage(spell.dmg);
    console.log(
      `Game#${this.id}: Dealing ${spell.dmg} dmg to player ${opponent.username}`
    );
    this.updatePlayer(opponent);
    this.update();
  }

  animateEvent(player, type, spellKey) {
    let color = player.id === this.playerOne.id ? "red" : "blue";
    let eventName = `${color}${type}`;
    this.broadcast(Constants.MSG.ANIMATIONS, {
      event: eventName,
      spell: spellKey
    });
  }

  serializeForUpdate() {
    return {
      gameId: this.id,
      state: this.state,
      result: this.result,
      playerOne: this.playerOne.serializeForUpdate(),
      playerTwo: this.playerTwo.serializeForUpdate(),
      roundTime: this.roundTime
    };
  }
}

module.exports = Game;
