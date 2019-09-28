//wizards
// red
import red_wizard_init from "./assets/wizards/wiz_red_init.png"
import red_wizard_attack from "./assets/wizards/wiz_red_attack.png"
import red_wizard_idle from "./assets/wizards/wiz_red_idle.png"
import red_wizard_hurt from "./assets/wizards/wiz_red_hurt.png"
import red_wizard_jump from "./assets/wizards/wiz_red_jump.png"
import red_wizard_dead from "./assets/wizards/wiz_red_dead.png"
// blue
import blue_wizard_init from "./assets/wizards/wiz_blue_init.png"
import blue_wizard_attack from "./assets/wizards/wiz_blue_attack.png"
import blue_wizard_idle from "./assets/wizards/wiz_blue_idle.png"
import blue_wizard_hurt from "./assets/wizards/wiz_blue_hurt.png"
import blue_wizard_jump from "./assets/wizards/wiz_blue_jump.png"
import blue_wizard_dead from "./assets/wizards/wiz_blue_dead.png"

//spells
//earth
import earth_weak from "./assets/spells/earth_weak.png"
import earth_medium from "./assets/spells/earth_medium.png"
import earth_strong from "./assets/spells/earth_strong.png"
//ice
import ice_weak from "./assets/spells/ice_weak.png"
import ice_medium from "./assets/spells/ice_medium.png"
import ice_strong from "./assets/spells/ice_strong.png"
//fire
import fire_weak from "./assets/spells/fire_weak.png"
import fire_medium from "./assets/spells/fire_medium.png"
import fire_strong from "./assets/spells/fire_strong.png"
//wind
import wind_weak from "./assets/spells/wind_weak.png"
import wind_medium from "./assets/spells/wind_medium.png"
import wind_strong from "./assets/spells/wind_strong.png"

// shots
import earth_shot from "./assets/shot/attack_earth.png"
import ice_shot from "./assets/shot/attack_ice.png"
import fire_shot from "./assets/shot/attack_fire.png"
import wind_shot from "./assets/shot/attack_wind.png"

export const wizards = {
    red: {
        init: {
            source: red_wizard_init,
            width: 624,
            height: 500,
            slices: 1,
            interval: 200,
        },
        attack: {
            source: red_wizard_attack,
            width: 624,
            height: 500,
            slices: 7,
            interval: 200,
        },
        idle: {
            source: red_wizard_idle,
            width: 624,
            height: 500,
            slices: 4,
            interval: 200,
        },
        hurt: {
            source: red_wizard_hurt,
            width: 624,
            height: 500,
            slices: 3,
            interval: 200,
        },
        jump: {
            source: red_wizard_jump,
            width: 624,
            height: 500,
            slices: 5,
            interval: 200,
        },
        dead: {
            source: red_wizard_dead,
            width: 624,
            height: 500,
            slices: 5,
            interval: 200,
        },
    },
    blue: {
        init: {
            source: blue_wizard_init,
            width: 624,
            height: 500,
            slices: 1,
            interval: 200,
        },
        attack: {
            source: blue_wizard_attack,
            width: 624,
            height: 500,
            slices: 7,
            interval: 200,
        },
        idle: {
            source: blue_wizard_idle,
            width: 624,
            height: 500,
            slices: 4,
            interval: 200,
        },
        hurt: {
            source: blue_wizard_hurt,
            width: 624,
            height: 500,
            slices: 3,
            interval: 200,
        },
        jump: {
            source: blue_wizard_jump,
            width: 624,
            height: 500,
            slices: 5,
            interval: 200,
        },
        dead: {
            source: blue_wizard_dead,
            width: 624,
            height: 500,
            slices: 5,
            interval: 200,
        },
  }
};

export const spells = {
    earth: {
      weak: {
          source: earth_weak,
          width: 599,
          height: 559,
          slices: 35,
          interval: 100,
      },
      medium: {
          source: earth_medium,
          width: 620,
          height: 530,
          slices: 43,
          interval: 100,
      },
      strong: {
          source: earth_strong,
          width: 899,
          height: 643,
          slices: 88,
          interval: 100,
      }
    },
    ice: {
        weak: {
            source: ice_weak,
            width: 483,
            height: 483,
            slices: 23,
            interval: 100,
        },
        medium: {
            source: ice_medium,
            width: 788,
            height: 788,
            slices: 50,
            interval: 100,
        },
        strong: {
            source: ice_strong,
            width: 742,
            height: 742,
            slices: 51,
            interval: 100,
        }
    },
    fire: {
        weak: {
            source: fire_weak,
            width: 483,
            height: 483,
            slices: 21,
            interval: 100,
        },
        medium: {
            source: fire_medium,
            width: 758,
            height: 540,
            slices: 38,
            interval: 100,
        },
        strong: {
            source: fire_strong,
            width: 727,
            height: 635,
            slices: 78,
            interval: 100,
        }
    },
    wind: {
        weak: {
            source: wind_weak,
            width: 880,
            height: 704,
            slices: 34,
            interval: 100,
        },
        medium: {
            source: wind_medium,
            width: 660,
            height: 660,
            slices: 29,
            interval: 100,
        },
        strong: {
            source: wind_strong,
            width: 880,
            height: 880,
            slices: 83,
            interval: 100,
        }
    },
};

export const shots = {
    earth: {
        source: earth_shot,
        width: 500,
        height: 500,
        slices: 60,
        interval: 100,
    },
    ice: {
        source: ice_shot,
        width: 500,
        height: 500,
        slices: 60,
        interval: 100,
    },
    fire: {
        source: fire_shot,
        width: 500,
        height: 500,
        slices: 60,
        interval: 100,
    },
    wind: {
        source: wind_shot,
        width: 500,
        height: 500,
        slices: 60,
        interval: 100,
    }
}