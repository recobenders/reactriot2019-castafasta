const Constants = require("./constants");

const spells = Object.freeze({
  fireball: {
    id: 1,
    key: "fireball",
    name: "Fireball",
    max_dmg: 200,
    numberOfSequences: 4
  },
  ice: {
    id: 2,
    key: "ice-blast",
    name: "Ice Blast",
    max_dmg: 250,
    numberOfSequences: 5
  },
  earthquake: {
    id: 3,
    key: "earthquake",
    name: "Earthquake",
    max_dmg: 300,
    numberOfSequences: 6
  },
  tornado: {
    id: 4,
    key: "tornado",
    name: "Tornado",
    max_dmg: 400,
    numberOfSequences: 8
  }
});

class Spell {
  static getSpells() {
    return spells;
  }

  static getSpell(name) {
    let spellStats = spells[name];
    return new Spell(spellStats);
  }

  constructor({ id, key, name, max_dmg, numberOfSequences }) {
    this.id = id;
    this.key = key;
    this.name = name;
    this.max_dmg = max_dmg;
    this.dmg = 0;

    this.generateRequiredSequences(numberOfSequences);
    this.capturedAccuracy = [];
  }

  generateRequiredSequences(numberOfSequences) {
    this.requiredSequences = [];

    let position = {
      x: Math.floor(Constants.SPELL_GRID_SIZE / 2),
      y: Math.floor(Constants.SPELL_GRID_SIZE / 2)
    };

    while (this.requiredSequences.length < numberOfSequences) {
      let possibleMovements = Constants.SPELL_DIRECTIONS.filter(
        spell =>
          position.x + spell.x >= 0 &&
          position.x + spell.x < Constants.SPELL_GRID_SIZE &&
          position.y + spell.y >= 0 &&
          position.y + spell.y < Constants.SPELL_GRID_SIZE
      );

      let movement =
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
      capturedAccuracy: this.capturedAccuracy
    };
  }
}

module.exports = Spell;
