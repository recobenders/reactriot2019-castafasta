import React, {Component} from "react";
import AnimatedWizard from "../Animations/AnimatedWizard";

class BattlegroundScene extends Component {
    render() {
        const { redConjuring, blueConjuring, redAttacking, blueAttacking, redWon, blueWon } = this.props;
        let redAction = "idle";
        let redActionRepeat = false;
        let blueAction = "idle";
        let blueActionRepeat = false;

        if (redConjuring) {
            redAction = "attack";
            redActionRepeat = true
        }

        if (blueConjuring) {
            blueAction = "attack";
            blueActionRepeat = true;
        }

        if (redAttacking) {
            redAction = "attack";
            redActionRepeat = false;
        }

        if (blueAttacking) {
            blueAction = "attack";
            blueActionRepeat = false;
        }

        if (redWon) {
            redAction = "jump";
            redActionRepeat = false;
            blueAction = "dead";
            blueActionRepeat = false;
        }

        if (blueWon) {
            blueAction = "jump";
            blueActionRepeat = false;
            redAction = "dead";
            redActionRepeat = false;
        }

        return (
            <>
                <AnimatedWizard wizardColor="red" wizardAction={redAction} repeat={redActionRepeat} repeatInterval={2000}/>
                <AnimatedWizard wizardColor="blue" wizardAction={blueAction} repeat={blueActionRepeat} repeatInterval={3000} tilt />
            </>
        );
    }
}

export default BattlegroundScene;
