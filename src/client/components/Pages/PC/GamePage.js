import React, { Component, Fragment } from "react";
import styled from "styled-components";
import Constants from "../../../../shared/constants";
import Battleground from "../../Game/Battleground";
import GameInfo from "../../Game/GameInfo";
import ResolutionPage from "./ResolutionPage";
import { Spin } from "antd";

const Wrapper = styled.section`
  width: 100%;
`;

const CenterOnPage = styled.section`
  height: 100vh
  display: flex
  justify-content: center;
  align-items: center
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
      this.setState({
        game: data,
        loading: false,
        finished: data.state === Constants.GAME_STATES.FINISHED
      });
    });

    this.props.socket.on(Constants.MSG.ANIMATIONS, ({ event, spell }) => {
      console.log(event);
      console.log(spell);
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
    return (
      <Fragment>
        <ResolutionPage
          game={this.state.game}
          currentUserId={this.props.userId}
        />
      </Fragment>
    );
  }

  renderGamePage() {
    if (this.state.loading) {
      return (
        <CenterOnPage>
          <Spin size="large" />
        </CenterOnPage>
      );
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
