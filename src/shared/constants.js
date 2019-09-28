module.exports = Object.freeze({
  PLAYER_MAX_HP: 2000,

  ROUND_SECONDS: 30,

  CRITICAL_CHANCE: 0.05,

  GAME_STATES: {
    INIT: "init",
    IN_PROGRESS: "in_progress",
    FINISHED: "finished"
  },

  PLAYER_STATES: {
    INIT: "init",
    QUEUED: "queued",
    IN_GAME: "in_game",
  },

  WINNING_TYPES: {
    DRAW: "draw",
    VICTORY: "victory"
  },

  MSG: {
    PREPARE_PLAYER: "prepare_player",
    WAITING_FOR_GAME: "waiting_for_game",
    NEW_PLAYER: "new_player",
    GAME_JOINED: "game_joined",
    GAME_STARTED: "game_started",
    GAME_UPDATE: "game_update",
    ERROR: "error"
  },

  QUEUE_CHECK_TIME: 1000
});
