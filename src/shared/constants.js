module.exports = Object.freeze({
  PLAYER_MAX_HP: 2000,

  ROUND_SECONDS: 30,

  GAME_STATES: {
    INIT: "init",
    IN_PROGRESS: "in_progress",
    FINISHED: "finished"
  },
  WINNING_TYPES: {
    DRAW: "draw",
    VICTORY: "victory"
  },

  MSG: {
    NEW_PLAYER: "new_player",
    FOUND_MATCH: "found_match"
  },

  QUEUE_CHECK_TIME: 5000
});
