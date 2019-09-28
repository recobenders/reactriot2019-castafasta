import React, { Component } from "react";
import HealthBar from "./HealthBar";
import styled from "styled-components";

const Wrapper = styled.section`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

class PlayerInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      player: props.player
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      player: nextProps.player
    });
  }

  render() {
    return (
      <Wrapper>
        <div>Player: {this.state.player.username}</div>
        <HealthBar hp={this.state.player.hp} />
      </Wrapper>
    );
  }
}

export default PlayerInfo;

