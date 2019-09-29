const Constants = require("../shared/constants");
const Spell = require("./spell");

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

    this.spellSelectedByPlayer(this.bot, this.bot.activeSpell.key);

    let spellTimeout = this.bot.activeSpell.requiredSequences.length * 1000;

    let futureSpellCast = new Promise((resolve, reject) => {
      setTimeout(resolve, spellTimeout);
    });

    futureSpellCast.then(() => {
      if (!this.isFinished()) {
        this.spellCastedbyBot(this.bot, this.bot.generateRandomAccuracies());
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

  whichPlayer(player) {
    return this.playerOne.id === player.id ? "playerOne" : "playerTwo";
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

  processCastStepbyPlayer(player, weight, capturedCode) {
    let returnedSpell = player.processSpellStep(weight, capturedCode);

    if (!returnedSpell) return;
    console.log(
      `Game#${this.id}: Player ${player.username} captured step ${capturedCode} with weight: ${weight}.`
    );

    if (returnedSpell.isCastingDone()) {
      this.animateAndDealDamage(player);
      returnedSpell.calculateDamage();
      this.animateEvent(player, "Attacking", returnedSpell);
      let opponent = this.getOpponent(player);
      opponent.takeDamage(returnedSpell.dmg);
      console.log(
        `Game#${this.id}: Player ${player.username} is dealing ${returnedSpell.dmg} dmg to player ${opponent.username}`
      );
    }
    this.updatePlayer(player);
    this.update();
  }

  animateAndDealDamage(player) {
    let spell = player.castSpell();
    this.animateEvent(player, "Attacking", spell);

    let opponent = this.getOpponent(spell);
    opponent.takeDamage(spell.dmg);
    this.updatePlayer(opponent);
    console.log(
      `Game#${this.id}: Bot dealing ${spell.dmg} dmg to player ${opponent.username}`
    );
  }

  spellCastedbyBot(bot, accuracies) {
    if (!bot.activeSpell) return;
    let spell = bot.activeSpell;
    for (let accuracy of accuracies) {
      spell.captureAccuracy(accuracy);
    }
    this.animateAndDealDamage(bot);
    this.updatePlayer(bot);
    this.update();
  }

  animateEvent(player, type, spell) {
    let color = player.id === this.playerOne.id ? "red" : "blue";
    let eventName = `${color}${type}`;
    this.broadcast(Constants.MSG.ANIMATIONS, {
      event: eventName,
      spell: spell
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
