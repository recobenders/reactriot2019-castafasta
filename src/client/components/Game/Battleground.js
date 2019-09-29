import React, { Component } from "react";
import styled from "styled-components"
import BattlegroundScene from "../Animations/BattlegroundScene"

const defaultState = {
    redConjuring: false,
    redAttacking: false,
    redWon: false,
    blueConjuring: false,
    blueAttacking: false,
    blueWon: false,
};

const BattleGroundBackgroundWrapper = styled.div `
    width: 100%;
    background: #424242;
`;

const BattlegroundWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end
    width: 60%;
    height: 350px;
    margin: 0px auto;
`;

class Battleground extends Component {
    state = {
        redConjuring: false,
        blueConjuring: false,
        redAttacking: false,
        blueAttacking: false,
        redWon: false,
        blueWon: false,
    };

    render() {
        const { redConjuring, blueConjuring, redAttacking, blueAttacking, redWon, blueWon } = this.state;

        console.log(redConjuring, redAttacking, redWon, blueConjuring, blueAttacking, blueWon);

        return (
            <BattleGroundBackgroundWrapper>
                <BattlegroundWrapper>
                   <BattlegroundScene {...this.state} />
                </BattlegroundWrapper>
                <button onClick={() => this.setState({...defaultState, redConjuring: true})}>Red Conjuring</button>
                <button onClick={() => this.setState({...defaultState, redAttacking: true})}>Red Attacking</button>
                <button onClick={() => this.setState({redConjuring: false, redAttacking: false, redWon: false})}>Red Idle</button>
                <button onClick={() => this.setState({...defaultState, redWon: true})}>Red Won</button>
                <button onClick={() => this.setState({...defaultState, blueConjuring: true})}>Blue Conjuring</button>
                <button onClick={() => this.setState({...defaultState, blueAttacking: true})}>Blue Attacking</button>
                <button onClick={() => this.setState({blueConjuring: false, blueAttacking: false, blueWon: false})}>Blue Idle</button>
                <button onClick={() => this.setState({...defaultState, blueWon: true})}>Blue Won</button>
            </BattleGroundBackgroundWrapper>
        );
    }
}

export default Battleground;

