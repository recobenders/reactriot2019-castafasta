import React, { Component, Fragment } from "react";
import styled from "styled-components";
import Constants from "../../../../shared/constants";
import Battleground from "../../Game/Battleground";
import GameInfo from "../../Game/GameInfo";
import Instructions from "../../Game/Instructions";
import ResolutionPage from "./ResolutionPage";
import { Spin, Layout } from "antd";
import background_castafasta from "../../Game/assets/background_castafasta.png"

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
      animation: null,
      updateBattleground: false,
      loading: true,
      finished: false,
      activeSpell: null
    };
  }

  componentDidMount() {
    this.props.socket.on(Constants.MSG.GAME_UPDATE, data => {
      console.log(data.playerOne.activeSpell);
      this.setState({
        game: data,
        loading: false,
        finished: data.state === Constants.GAME_STATES.FINISHED
      });

      if (data.playerOne.id === this.props.userId) {
        this.setState({
          activeSpell: data.playerOne.activeSpell
        });
      } else {
        this.setState({
          activeSpell: data.playerTwo.activeSpell
        });
      }

    });

    this.props.socket.on(Constants.MSG.ANIMATIONS, data => {
      this.setState({
        animation: data,
        updateBattleground: !this.state.updateBattleground
      });
    });
  }

  activeGamePage() {
    const { Content, Footer, Header } = Layout;

    return (
      <Layout style={{height:"100vh", background: `url('${background_castafasta}') 0px 85%`, backgroundSize: "cover", backgroundPosition: "bottom"}}>
        <Header style={{
          background: "transparent",
          marginTop: "auto",
          height: "40vh",
          textAlign: "center",
          verticalAlign: "middle",
          fontSize: "15em",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#00000"
        }}>
          <Instructions style={{zIndex: "1000", margin: "auto"}} spell={this.state.activeSpell} />
        </Header>
          <Content style={{background: "transparent", display: "flex"}}>
            <Battleground
              animation={this.state.animation}
              updateBattleground={this.state.updateBattleground}
            />
        </Content>
        <Footer style={{background: "transparent"}}>
          <GameInfo game={this.state.game} />
        </Footer>
      </Layout>
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
