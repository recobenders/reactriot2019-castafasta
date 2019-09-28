module.exports = Object.freeze({
  PLAYER_MAX_HP: 1000,

  ROUND_SECONDS: 30,
  GAME_TICK: 1000,

  CRITICAL_CHANCE: 0.05,
  BOT_CHANCE_TO_CAST: 0.5,

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

  RESOLUTION_TYPES: {
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
    PLAYER_CAST_SPELL: "player_cast_spell",
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
