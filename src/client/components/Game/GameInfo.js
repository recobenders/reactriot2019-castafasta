import React, { Component, Fragment } from "react";
import PlayerInfo from "./PlayerInfo";
import styled from "styled-components";
import Title from "antd/lib/typography/Title";

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
        <Row style={{ marginTop: 0, marginBottom: 0 }}>
          <Column style={{ margin: 0 }}>
            <Title level={4} style={{ textAlign: "center", fontFamily: "HarryFont", fontSize: "5em", fontWeight: 5 }}>
              {this.props.game.roundTime}
            </Title>
          </Column>
        </Row>
        <Row style={{ marginTop: 0, marginBottom: 0 }}>
          <Column style={{ marginTop: 0, marginBottom: 0 }}>
            <PlayerInfo player={this.props.game.playerOne} />
          </Column>
          <Column style={{ marginTop: 0, marginBottom: 0 }}>
            <PlayerInfo player={this.props.game.playerTwo} tilt />
          </Column>
        </Row>
      </Fragment>
    );
  }
}

export default GameInfo;
