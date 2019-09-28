import React, { Component } from "react";
import PlayerInfo from "./PlayerInfo";
import styled from "styled-components";

const Row = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
  flex: 1;
  margin: 15px;
`;

class GameInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playerOne: props.game.playerOne,
      playerTwo: props.game.playerTwo
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      playerOne: nextProps.game.playerOne,
      playerTwo: nextProps.game.playerTwo,
    });
  }

  render() {
    return (
      <Row>
        <Column>
          <PlayerInfo player={this.state.playerOne} />
        </Column>
        <Column>
          <PlayerInfo player={this.state.playerTwo} />
        </Column>
      </Row>
    );
  }
}

export default GameInfo;

