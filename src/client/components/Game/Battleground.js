import React, { Component } from "react";
import styled from "styled-components"
import BattlegroundScene from "../Animations/BattlegroundScene"

const BattleGroundBackgroundWrapper = styled.div `
    width: 100%;
    background: #424242;
    align-self: flex-end;
`;

const BattlegroundWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end
    width: 60%;
    height: 350px;
    margin: 0px auto;
`;

const defaultState = {
    redConjuring: false,
    blueConjuring: false,
    redAttacking: false,
    blueAttacking: false,
    redWon: false,
    blueWon: false,
    redIdle: false,
    blueIdle: false,
    spellType: "wind",
    spellPower: "weak",
};

class Battleground extends Component {
    state = {
        ...defaultState,
        redIdle: true,
        blueIdle: true,
    };

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return nextProps.updateBattleground !== this.props.updateBattleground
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.updateBattleground !== this.props.updateBattleground && nextProps.animation) {
            const {event, spell} = nextProps.animation;

            switch (event) {
                case "redConjuring":
                    this.setState({...defaultState, redConjuring: true});
                    break;
                case "blueConjuring":
                    this.setState({...defaultState, blueConjuring: true});
                    break;
                case "redAttacking":
                    this.setState({...defaultState, redAttacking: true, ...spell});
                    break;
                case "blueAttacking":
                    this.setState({...defaultState, blueAttacking: true, ...spell});
                    break;
                case "redWon":
                    this.setState({...defaultState, redWon: true});
                    break;
                case "blueWon":
                    this.setState({...defaultState, blueWon: true});
                    break;
                default:
                    this.setState({...defaultState, redIdle: true, blueIdle: true});
                    break;
            }
        }
    }

    render() {
        return (
            <BattleGroundBackgroundWrapper>
                <BattlegroundWrapper>
                    {<BattlegroundScene {...this.state} />}
                </BattlegroundWrapper>
                {/*<button onClick={() => this.setState({...defaultState, redConjuring: true})}>Red Conjuring</button>*/}
                {/*<button onClick={() => this.setState({...defaultState, redAttacking: true})}>Red Attacking</button>*/}
                {/*<button onClick={() => this.setState({redConjuring: false, redAttacking: false, redWon: false})}>Red Idle</button>*/}
                {/*<button onClick={() => this.setState({...defaultState, redWon: true})}>Red Won</button>*/}
                {/*<button onClick={() => this.setState({...defaultState, blueConjuring: true})}>Blue Conjuring</button>*/}
                {/*<button onClick={() => this.setState({...defaultState, blueAttacking: true})}>Blue Attacking</button>*/}
                {/*<button onClick={() => this.setState({blueConjuring: false, blueAttacking: false, blueWon: false})}>Blue Idle</button>*/}
                {/*<button onClick={() => this.setState({...defaultState, blueWon: true})}>Blue Won</button>*/}
            </BattleGroundBackgroundWrapper>
        );
    }
}

export default Battleground;

