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
    PREPARE_PLAYER: "prepare_player",
    NEW_PLAYER: "new_player",
    GAME_JOINED: "game_joined",
    GAME_STARTED: "game_started",
    GAME_UPDATE: "game_update"
  },

  QUEUE_CHECK_TIME: 1000
});
