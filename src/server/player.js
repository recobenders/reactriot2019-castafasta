const Constants = require("../shared/constants");

class Player {
  constructor(id, username, browserSocket) {
    this.id = id;
    this.username = username;
    this.hp = Constants.PLAYER_MAX_HP;
    this.browser_socket = browserSocket;
    // this.mobile_socket = mobile_socket;
  }

  takeDamage(damage) {
    this.hp -= damage;
  }

  serializeForUpdate() {
    return {
      id: this.id,
      username: this.username,
      hp: this.hp
    };
  }
}

module.exports = Player;
