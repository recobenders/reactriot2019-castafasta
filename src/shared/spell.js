const Constants = require("./constants");

const spells = Object.freeze({
  fireBolt: {
    id: 1,
    key: "fireBolt",
    name: "Fire Bolt",
    max_dmg: 150,
    numberOfSequences: 3,
    spellType: "fire",
    spellPower: "weak"
  },
  meteor: {
    id: 2,
    key: "meteor",
    name: "Meteor",
    max_dmg: 300,
    numberOfSequences: 4,
    spellType: "fire",
    spellPower: "medium"
  },
  fieryImplosion: {
    id: 3,
    key: "fieryImplosion",
    name: "Fiery Implosion",
    max_dmg: 500,
    numberOfSequences: 6,
    spellType: "fire",
    spellPower: "strong"
  },
  glacialTouch: {
    id: 4,
    key: "glacialTouch",
    name: "Glacial Touch",
    max_dmg: 250,
    numberOfSequences: 4,
    spellType: "ice",
    spellPower: "weak"
  },
  iceCrash: {
    id: 5,
    key: "iceCrash",
    name: "Ice Crash",
    max_dmg: 300,
    numberOfSequences: 4,
    spellType: "ice",
    spellPower: "medium"
  }, 
  frostSpike: {
    id: 6,
    key: "frostSpike",
    name: "Frost Spike",
    max_dmg: 550,
    numberOfSequences: 5,
    spellType: "ice",
    spellPower: "strong"
  }, 
  whirlingBlades: {
    id: 7,
    key: "whirlingBlades",
    name: "Whirling Blades",
    max_dmg: 100,
    numberOfSequences: 2,
    spellType: "wind",
    spellPower: "weak"
  }, 
  shredder: {
    id: 8,
    key: "shredder",
    name: "Shredder",
    max_dmg: 400,
    numberOfSequences: 4,
    spellType: "wind",
    spellPower: "medium"
  }, 
  tornado: {
    id: 9,
    key: "tornado",
    name: "Tornado",
    max_dmg: 600,
    numberOfSequences: 7,
    spellType: "wind",
    spellPower: "strong"
  },
  boulderSlam: {
    id: 10,
    key: "boulderSlam",
    name: "Boulder Slam",
    max_dmg: 400,
    numberOfSequences: 5,
    spellType: "earth",
    spellPower: "weak"
  },
  talonsFromThePast: {
    id: 11,
    key: "talonsFromThePast",
    name: "Talons from the Past",
    max_dmg: 600,
    numberOfSequences: 7,
    spellType: "earth",
    spellPower: "medium"
  },
  titanClap: {
    id: 12,
    key: "titanClap",
    name: "Titan Clap",
    max_dmg: 1000,
    numberOfSequences: 10,
    spellType: "earth",
    spellPower: "strong"
  }
});

class Spell {
  static getSpells() {
    return spells;
  }

  static getSpell(key) {
    let spellStats = spells[key];
    return new Spell(spellStats);
  }

  constructor({ key, name, max_dmg, numberOfSequences }) {
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
