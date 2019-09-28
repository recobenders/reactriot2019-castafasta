import React, { Component } from "react";
import styled from "styled-components";
import Constants from "../../../../shared/constants";
import Battleground from "../../Game/Battleground";
import GameInfo from "../../Game/GameInfo";

const Wrapper = styled.section`
  width: 100%;
`;

export class GamePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      game: null,
      loading: true
    };
  }

  componentDidMount() {
    this.props.socket.on(Constants.MSG.GAME_UPDATE, data => {
      console.log(data);
      this.setState({
        game: data,
        loading: false
      });
    });
  }

  render() {
    if (this.state.loading) {
      // TODO replace with a loader or make sure we get all the data on initialization
      return (<Wrapper>Loading</Wrapper>);
    }

    return (
      <Wrapper>
        <Battleground />
        <GameInfo game={this.state.game} />
      </Wrapper>
    );
  }
}
