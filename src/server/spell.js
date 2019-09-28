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

    this.generateRequiredSequences(numberOfSequences);
    this.capturedAccuracy = [0.8, 0.75, 0.9];
  }

  generateRequiredSequences(numberOfSequences) {
    this.requiredSequences = [];

    let position = {
      x: Math.floor(Constants.SPELL_GRID_SIZE / 2),
      y: Math.floor(Constants.SPELL_GRID_SIZE / 2)
    };

    while (this.requiredSequences.length < numberOfSequences) {
      let possibleMovements = Constants.SPELL_DIRECTIONS.filter(spell =>
        position.x + spell.x >= 0 &&
        position.x + spell.x < Constants.SPELL_GRID_SIZE &&
        position.y + spell.y >= 0 &&
        position.y + spell.y < Constants.SPELL_GRID_SIZE
      );

      let movement = possibleMovements[Math.floor(Math.random()*possibleMovements.length)];
      position.x += movement.x;
      position.y += movement.y;
      this.requiredSequences.push(movement.value);
    }

    return this.requiredSequences;
  }

  captureAccuracy(accuracy) {
    this.capturedAccuracy.push(parseFloat(accuracy));
  }

  captureAccuracies(accuracies) {
    this.capturedAccuracy = accuracies.map(Number);
  }

  currentRequiredSequence() {
    return this.requiredSequences[this.capturedAccuracy.length];
  }

  isCastingDone() {
    return this.capturedAccuracy.length === this.requiredSequences.length;
  }

  calculateDamage() {
    if (!this.isCastingDone) return;
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
