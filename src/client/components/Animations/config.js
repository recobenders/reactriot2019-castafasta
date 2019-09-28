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