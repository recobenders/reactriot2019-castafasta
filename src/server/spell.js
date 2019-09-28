const Constants = require("../shared/constants");

const spells = Object.freeze({
  fireball: { name: "Fireball", max_dmg: 100, numberOfSequences: 4 },
  tornado: { name: "Tornado", max_dmg: 400, numberOfSequences: 8 }
});

class Spell {
  static get_spell(name) {
    let spellStats = spells[name];
    return new Spell(spellStats);
  }

  constructor({ name, max_dmg, numberOfSequences }) {
    this.name = name;
    this.max_dmg = max_dmg;

    this.generateRequiredSequencies(numberOfSequences);
    this.capturedAccuracy = [0.8, 0.75, 0.9];
  }

  generateRequiredSequencies(numberOfSequences) {
    // TODO Calculate required sequences based on GRID
    this.requiredSequences = [0, 0, 1, 2];
  }

  captureAccuracy(accuracy) {
    this.capturedAccuracy.push(accuracy);
  }

  currentRequiredSequence() {
    return this.requiredSequences[this.capturedAccuracy.length];
  }

  isCastingDone() {
    return this.capturedAccuracy.length === this.requiredSequences.length;
  }

  calculateDamage() {
    if (!this.isCastingDone()) return;
    let sum = this.capturedAccuracy.reduce(
      (previous, current) => (current += previous)
    );
    let avg = sum / this.capturedAccuracy.length;

    let damage = Math.floor(Math.pow(avg, 2) * this.max_dmg);

    if (Math.random() < Constants.CRITICAL_CHANCE) {
      //   damage = 2 * damage;
    }
    return damage;
  }
}

module.exports = Spell;
