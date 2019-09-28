import React, { Component } from "react";
import styled from "styled-components"
import BattlegroundScene from "../Animations/BattlegroundScene"


const BattleGroundBackgroundWrapper = styled.div `
    width: 100%;
    background: #424242;
`;

const BattlegroundWrapper = styled.div`
    display: flef;
    justify-content: space-between;
    width: 60%;
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
                <button onClick={() => this.setState({redConjuring: true, redAttacking: false, redWon: false})}>Red Conjuring</button>
                <button onClick={() => this.setState({redAttacking: true, redConjuring: false, redWon: false})}>Red Attacking</button>
                <button onClick={() => this.setState({redAttacking: false, redConjuring: false, redWon: false})}>Red Idle</button>
                <button onClick={() => this.setState({redWon: true, redConjuring: false, redAttacking: false})}>Red Won</button>
                <button onClick={() => this.setState({blueConjuring: true, blueAttacking: false, blueWon: false})}>Blue Conjuring</button>
                <button onClick={() => this.setState({blueAttacking: true, blueConjuring: false, blueWon: false})}>Blue Attacking</button>
                <button onClick={() => this.setState({blueAttacking: false, blueConjuring: false, blueWon: false})}>Blue Idle</button>
                <button onClick={() => this.setState({blueWon: true, blueConjuring: false, blueAttacking: false})}>Blue Won</button>
            </BattleGroundBackgroundWrapper>
        );
    }
}

export default Battleground;

