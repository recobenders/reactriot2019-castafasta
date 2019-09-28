import React, { Component, Fragment } from "react";
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
      loading: true,
      finished: false
    };
  }

  componentDidMount() {
    this.props.socket.on(Constants.MSG.GAME_UPDATE, data => {
      console.log(data);
      this.setState({
        game: data,
        loading: false,
        finished: data.state === Constants.GAME_STATES.FINISHED
      });
    });

    this.props.socket.on(Constants.MSG.PLAYER_CAST_SPELL, data => {
      if (data.player.id === this.props.userId) {
        console.log(`I have casted a: ${data.spell.name}`);
      } else {
        console.log(`Opponent has casted a: ${data.spell.name}`);
      }
    });
  }

  activeGamePage() {
    return (
      <Fragment>
        <Battleground />
        <GameInfo game={this.state.game} />
      </Fragment>
    );
  }

  resolvedGamePage() {
    return <Fragment>Game finished</Fragment>;
  }

  renderGamePage() {
    if (this.state.loading) {
      // TODO replace with a loader or make sure we get all the data on initialization
      return <Wrapper>Loading</Wrapper>;
    }

    if (this.state.finished) {
      return this.resolvedGamePage();
    }
    return this.activeGamePage();
  }

  render() {
    return <Wrapper>{this.renderGamePage()}</Wrapper>;
  }
}
