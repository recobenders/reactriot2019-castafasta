const Constants = require("../shared/constants");

class Player {
  constructor(id, username, browser_socket, mobile_socket) {
    this.id = id;
    this.username = username;
    this.hp = Constants.PLAYER_MAX_HP;
    this.browser_socket = browser_socket;
    this.mobile_socket = mobile_socket;
  }

  takeDamage(damage) {
    this.hp -= damage;
  }
}

module.exports = Player;
