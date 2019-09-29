import React, {Component} from "react";
import styled from "styled-components";

import AnimatedWizard from "../Animations/AnimatedWizard";
import AnimatedSpell from "../Animations/AnimatedSpell";
import {spells} from "./config";
import AnimatedShot from "../Animations/AnimatedShot";


const WizzardWrapper = styled.div`
    position: relative;
    ${({rotate}) => rotate && `transform: rotate3d(0, 1, 0, 180deg)`}
`;

const SpellWrapper = styled.div`
    position: absolute;
    ${({bottom}) => bottom ? `bottom: ${bottom}px` : `bottom: 20px`}
    ${({left}) => left ? `left: ${left}px` : `left: 20px`}
`;

const ShotWrapper = styled.div`
    position: absolute;
    ${({bottom}) => bottom ? `bottom: ${bottom}px` : `bottom: 20px`}
    ${({left}) => left ? `left: ${left}px` : `left: 20px`}
`;


const defautState = {
      redAction: "init",
      redActionRepeat: false,
      updateRedWizard: false,
      updateRedSpell: false,
      blueAction: "init",
      blueActionRepeat: false,
      updateBlueWizard: false,
      updateBlueSpell: false,
      redActionRepeatInterval: 2000,
      blueActionRepeatInterval: 2000,
    };

class BattlegroundScene extends Component {
    state = {
        ...defautState,
        initedRedSpell: false,
        initedBlueSpell: false,
    };

    componentWillReceiveProps(nextProps, nextContext) {
        const { redConjuring, blueConjuring, redAttacking, blueAttacking, redWon, blueWon } = nextProps;

        if (redConjuring) {
            const optional = !blueConjuring && !blueAttacking ? {
                blueAction: "idle",
                blueActionRepeat: true,
                blueActionRepeatInterval: 3500,
                updateBlueWizard: true,
                } : {};
            this.setState({
                ...defautState,
                redAction: "attack",
                redActionRepeat: true,
                redActionRepeatInterval: 2000,
                updateRedWizard: true,
                ...optional,
            })
        }

        if (blueConjuring) {
            const optional = !redConjuring && !redAttacking ? {
                redAction: "idle",
                redActionRepeat: true,
                redActionRepeatInterval: 3500,
                updateRedWizard: true,
                } : {};
            this.setState({
                ...defautState,
                blueAction:"attack",
                blueActionRepeat: true,
                blueActionRepeatInterval: 2000,
                updateBlueWizard: true,
                ...optional,
            })
        }

        if (redAttacking) {
            this.setState({
                ...defautState,
                redAction: "attack",
                redActionRepeat: false,
                updateRedWizard: true,
                blueAction: "hurt",
                updateBlueWizard: true,
                updateBlueSpell: true,
                initedBlueSpell: true,
            });
        }

        if (blueAttacking) {
            this.setState({
                ...defautState,
                blueAction: "attack",
                blueActionRepeat: false,
                updateBlueWizard: true,
                redAction: "hurt",
                updateRedWizard: true,
                updateRedSpell: true,
                initedRedSpell: true,
            });
        }

        if (redWon) {
            this.setState({
                ...defautState,
                redAction: "jump",
                updateRedWizard: true,
                blueAction: "dead",
                updateBlueWizard: true,
            });
        }

        if (blueWon) {
            this.setState({
                ...defautState,
                blueAction: "jump",
                updateBlueWizard: true,
                redAction: "dead",
                updateRedWizard: true,
            });
        }
    }

    render() {
        const {
            redAction,
            redActionRepeat,
            redActionRepeatInterval,
            blueAction,
            blueActionRepeat,
            blueActionRepeatInterval,
            updateRedWizard,
            updateRedSpell,
            initedRedSpell,
            updateBlueWizard,
            updateBlueSpell,
            initedBlueSpell,
        } = this.state;

        return (
            <>
                <WizzardWrapper>
                    <AnimatedWizard
                        wizardColor="red"
                        wizardAction={redAction}
                        repeat={redActionRepeat}
                        repeatInterval={redActionRepeatInterval}
                        update={updateRedWizard}
                    />
                    {initedRedSpell &&
                        <SpellWrapper bottom={spells["fire"]["strong"]["bottom"]} left={spells["fire"]["strong"]["left"]}>
                            <AnimatedSpell
                                spell={spells["fire"]["strong"]}
                                update={updateRedSpell}
                            />
                        </SpellWrapper>
                    }
                    <ShotWrapper bottom={100} left={200}>
                        <AnimatedShot shotType="fire" update={updateBlueSpell} />
                    </ShotWrapper>
                </WizzardWrapper>
                <WizzardWrapper rotate={true}>
                    <AnimatedWizard
                        wizardColor="blue"
                        wizardAction={blueAction}
                        repeat={blueActionRepeat}
                        repeatInterval={blueActionRepeatInterval}
                        update={updateBlueWizard}
                    />
                    {initedBlueSpell &&
                        <SpellWrapper bottom={spells["fire"]["strong"]["bottom"]} left={spells["fire"]["strong"]["left"]}>
                            <AnimatedSpell
                                spell={spells["fire"]["strong"]}
                                update={updateBlueSpell}
                            />
                        </SpellWrapper>
                    }
                    <ShotWrapper bottom={100} left={100}>
                        <AnimatedShot shotType="fire" update={updateRedSpell}/>
                    </ShotWrapper>
                </WizzardWrapper>
            </>
        );
    }
}

export default BattlegroundScene;
