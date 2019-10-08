const Constants = require("../shared/constants");
const spells = require("../shared/spells");

class Spell {
  static getSpells() {
    return spells;
  }

  static getSpell(key) {
    let spellStats = spells[key];
    return new Spell(spellStats);
  }

  constructor({ key, name, max_dmg, numberOfSequences, spellType, spellPower }) {
    this.key = key;
    this.name = name;
    this.max_dmg = max_dmg;
    this.dmg = 0;
    this.spellType = spellType;
    this.spellPower = spellPower;

    this.generateRequiredSequences(numberOfSequences);
    this.capturedAccuracy = [];
  }

  generateRequiredSequences(numberOfSequences) {
    this.requiredSequences = [];

    let position = {
      x: Math.floor(Constants.SPELL_GRID_SIZE / 2),
      y: Math.floor(Constants.SPELL_GRID_SIZE / 2)
    };

    let movement = null;
    while (this.requiredSequences.length < numberOfSequences) {
      let possibleMovements = Constants.SPELL_DIRECTIONS.filter(
        direction =>
          position.x + direction.x >= 0 &&
          position.x + direction.x < Constants.SPELL_GRID_SIZE &&
          position.y + direction.y >= 0 &&
          position.y + direction.y < Constants.SPELL_GRID_SIZE
      );

      if (movement) {
        possibleMovements = possibleMovements.filter(
          direction => direction.value !== movement.value
        );
      }

      movement =
        possibleMovements[Math.floor(Math.random() * possibleMovements.length)];
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

    this.dmg = Math.floor(Math.pow(avg, 2) * this.max_dmg);

    if (Math.random() < Constants.CRITICAL_CHANCE) {
      //   this.dmg = 2 * this.dmg;
    }
    return this.dmg;
  }

  serializeForUpdate() {
    return {
      id: this.id,
      name: this.name,
      max_dmg: this.max_dmg,
      requiredSequences: this.requiredSequences,
      capturedAccuracy: this.capturedAccuracy,
      spellType: this.spellType,
      spellPower: this.spellPower
    };
  }
}

module.exports = Spell;
