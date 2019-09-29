module.exports = Object.freeze({
  PLAYER_MAX_HP: 2000,

  ROUND_SECONDS: 90,
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
    USER_INFO: "user_info",
    PREPARE_PLAYER: "prepare_player",
    WAITING_FOR_GAME: "waiting_for_game",
    NEW_PLAYER: "new_player",
    PLAYER_LEFT_QUEUE: "player_left_queue",
    ANOTHER_GAME: "another_game",
    SPELL_SELECTED: "spell_selected",
    CASTING_STEP: "casting_step",
    ANIMATIONS: "animations",
    GAME_JOINED: "game_joined",
    GAME_STARTED: "game_started",
    GAME_UPDATE: "game_update",
    ERROR: "server_error"
  },

  QUEUE_CHECK_TIME: 1000,

  SPELL_GRID_SIZE: 3,

  SPELL_DIRECTIONS: [
    { value: 0, x: 0, y: 1 }, // UP
    { value: 1, x: 0, y: -1 }, // DOWN
    { value: 2, x: 1, y: 0 }, // RIGHT
    { value: 3, x: -1, y: 0 } // LEFT
  ],

  DIRECTION_DETECTION: {
    SUPPORTED_FILTERS: {
      LOW_PASS: "lowPass",
      EXPONENTIAL: "exponential",
      THRESHOLD: "threshold",
      INTEGRATION: "integrate",
      CLAMP: "clamp",
      ZERO: "zero"
    },
    SELECTED_MODE: "orientation",
    MODES: [
      {
        MODE: "orientation",
        PIPELINE: [
          {
            NAME: "raw",
            FILTERS: [
              {
                TYPE: "zero", // TODO linear transform
                AXES: ["y"] // TODO transform matrix instead
              }
            ]
          },
          {
            NAME: "smooth",
            FILTERS: [
              {
                TYPE: "lowPass",
                WINDOW_SIZE: 10
              }
            ]
          },
          {
            NAME: "clamped",
            FILTERS: [
              {
                TYPE: "clamp",
                LIMIT: 50
              }
            ]
          }
        ],
        DIRECTION: {
          DISTANCE_THRESHOLD_MIN: 8,
          GROUP_DURATION_MIN: 100,
          GROUP_DURATION_MAX: 300
        }
      },
      {
        MODE: "motion",
        INCLUDE_GRAVITY: false,
        PIPELINE: [
          {
            NAME: "smooth_raw",
            FILTERS: [
              {
                TYPE: "lowPass",
                WINDOW_SIZE: 5
              },
              {
                TYPE: "threshold",
                THRESHOLD_VALUE: 0.07
              }
            ]
          },
          {
            NAME: "velocity",
            FILTERS: [
              {
                TYPE: "integrate",
                RESET: {
                  THRESHOLD_VALUE: 0.02,
                  SAMPLES_COUNT_LIMIT: 4
                }
              },
              {
                TYPE: "threshold",
                THRESHOLD_VALUE: 0.02
              },
              {
                TYPE: "lowPass",
                THRESHOLD_VALUE: 15
              }
            ]
          }
        ],
        DIRECTION: {
          DISTANCE_THRESHOLD_MIN: 0.2,
          GROUP_DURATION_MIN: 100,
          GROUP_DURATION_MAX: 400
        }
      }
    ]
  }
});
