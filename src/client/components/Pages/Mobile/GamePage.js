import React, { Component, Fragment } from "react";
import styled from "styled-components";
import Constants from "../../../../shared/constants";
import SpellForm from "../../Forms/SpellForm";
import Wand from "../../Game/Wand";
import { Spin, Button } from "antd";
import Title from "antd/lib/typography/Title";
import SpellSelector from "../../Game/SpellSelector";

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;

export class GamePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUserId: this.props.userId,
      activeCasting: false,
      activeSpell: null,
      game: null,
      loading: true,
      finished: false,
      availableSpells: [],
      player: null,
    };
  }

  componentDidMount() {
    this.props.socket.on(Constants.MSG.GAME_UPDATE, data => {
      if (data.playerOne.id === this.state.currentUserId) {
        this.setState({
          activeCasting: data.playerOne.activeSpell !== null,
          activeSpell: data.playerOne.activeSpell,
          availableSpells: data.playerOne.availableSpells
        });
      } else {
        this.setState({
          activeCasting: data.playerTwo.activeSpell !== null,
          activeSpell: data.playerTwo.activeSpell,
          availableSpells: data.playerTwo.availableSpells
        });
      }

      this.setState({
        game: data,
        loading: false,
        finished: data.state === Constants.GAME_STATES.FINISHED
      });
    });

    this.props.socket.on(Constants.MSG.WAITING_FOR_GAME, () => {
      this.props.history.push("/mobile/waiting");
    });

    this.props.socket.emit(Constants.MSG.USER_INFO, data => {
      this.setState({player: data});
    });
  }

  handleDamageSubmit(code, weight) {
    this.props.socket.emit(Constants.MSG.CASTING_STEP, code, weight);
  }

  renderGamePage() {
    if (this.state.loading) {
      // TODO replace with a loader or make sure we get all the data on initialization
      return <Spin size="large" />;
    }
    if (this.state.finished) {
      return this.resolvedGamePage();
    }
    if (this.state.activeCasting) {
      return this.activeCastingGamePage();
    }
    return this.spellSummaryGamePage();
  }

  activeCastingGamePage() {
    return (
      <Fragment>
        <Wand spell={this.state.activeSpell} socket={this.props.socket} player={this.state.player} />
        <SpellForm handleFormSubmit={this.handleDamageSubmit.bind(this)} />
      </Fragment>
    );
  }

  handleStartAnotherGame(type) {
    let singlePlayer = type === "singleplayer";
    this.props.socket.emit(Constants.MSG.ANOTHER_GAME, {
      singlePlayer: singlePlayer
    });
  }

  resolvedGamePage() {
    return (
      <Fragment>
        <Title level={2}>Game finished</Title>
        <Title level={4}>One more time?</Title>
        <div>
          <Button
            onClick={event => this.handleStartAnotherGame("multiplayer")}
            type="primary"
            style={{ marginBottom: "0.5em" }}
            size="large"
            htmlType="submit"
            icon="user"
          >
            Let's face another player, shall we?
          </Button>
        </div>
        <div>
          <Button
            htmlType="submit"
            icon="code"
            size="large"
            onClick={() => this.handleStartAnotherGame("singleplayer")}
          >
            The bot is a fine gentleman, thank you
          </Button>
        </div>
      </Fragment>
    );
  }

  handleSpellClick(spellKey) {
    this.props.socket.emit(Constants.MSG.SPELL_SELECTED, spellKey);
  }

  spellSummaryGamePage() {
    return (
      <Fragment>
        <div>Please select your spell:</div>
        <SpellSelector
          spells={Object.values(this.state.availableSpells)}
          handleSpellSelected={this.handleSpellClick.bind(this)}
        />
      </Fragment>
    );
  }

  render() {
    return <Wrapper>{this.renderGamePage()}</Wrapper>;
  }
}
