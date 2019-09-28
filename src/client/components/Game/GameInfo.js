import React, { Component, Fragment } from "react";
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
  render() {
    return (
      <Fragment>
        <Row>
          <Column>
            <div style={{ textAlign: "center" }}>
              {this.props.game.roundTime}
            </div>
          </Column>
        </Row>
        <Row>
          <Column>
            <PlayerInfo player={this.props.game.playerOne} />
          </Column>
          <Column>
            <PlayerInfo player={this.props.game.playerTwo} />
          </Column>
        </Row>
      </Fragment>
    );
  }
}

export default GameInfo;
