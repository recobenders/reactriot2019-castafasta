module.exports = Object.freeze({
  PLAYER_MAX_HP: 2000,

  ROUND_SECONDS: 30,

  CRITICAL_CHANCE: 0.05,

  // Set to 1 if Multiplayer
  MULTIPLAYER: 0,

  GAME_STATES: {
    INIT: "init",
    IN_PROGRESS: "in_progress",
    FINISHED: "finished"
  },

  PLAYER_STATES: {
    INIT: "init",
    QUEUED: "queued",
    IN_GAME: "in_game"
  },

  WINNING_TYPES: {
    DRAW: "draw",
    VICTORY: "victory"
  },

  MSG: {
    PREPARE_PLAYER: "prepare_player",
    WAITING_FOR_GAME: "waiting_for_game",
    NEW_PLAYER: "new_player",
    PLAYER_LEFT_QUEUE: "player_left_queue",
    SPELL_SELECTED: "spell_selected",
    CASTING_DONE: "casting_done",
    GAME_JOINED: "game_joined",
    GAME_STARTED: "game_started",
    GAME_UPDATE: "game_update",
    ERROR: "error"
  },

  QUEUE_CHECK_TIME: 1000,

  SPELL_GRID_SIZE: 3,

  SPELL_DIRECTIONS: [
    { value: 0, x: 0, y: 1 }, // UP
    { value: 1, x: 0, y: -1 }, // DOWN
    { value: 2, x: 1, y: 0 }, // RIGHT
    { value: 3, x: -1, y: 0 } // LEFT
  ]
});
