import React, { Component, Fragment } from "react";
import styled from "styled-components";
import Constants from "../../../../shared/constants";
import SpellForm from "../../Forms/SpellForm";

const Wrapper = styled.section`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export class GamePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUserId: this.props.userId,
      activeCasting: false,
      game: null,
      loading: true,
      finished: false,
      availableSpells: []
    };
  }

  componentDidMount() {
    this.props.socket.on(Constants.MSG.GAME_UPDATE, data => {
      console.log(data);

      if (data.playerOne.id === this.state.currentUserId) {
        this.setState({
          activeCasting: data.playerOne.activeSpell !== null,
          availableSpells: data.playerOne.availableSpells
        });
      } else {
        this.setState({
          activeCasting: data.playerTwo.activeSpell !== null,
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
  }

  handleDamageSubmit(value) {
    let accuracies = value.split(" ");
    this.props.socket.emit(Constants.MSG.CASTING_DONE, accuracies);
  }

  renderGamePage() {
    if (this.state.loading) {
      // TODO replace with a loader or make sure we get all the data on initialization
      return <div>Loading</div>;
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
        <div>Active Casting: {}</div>
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
        <div>Game finished</div>
        <div>
          <button onClick={() => this.handleStartAnotherGame("multiplayer")}>
            Start New Multiplayer Game
          </button>
        </div>
        <div>
          <button onClick={() => this.handleStartAnotherGame("singleplayer")}>
            Start New Singleplayer Game
          </button>
        </div>
      </Fragment>
    );
  }

  handleSpellClick(spellKey) {
    this.props.socket.emit(Constants.MSG.SPELL_SELECTED, spellKey);
  }

  renderSpellItem(spells) {
    return Object.keys(spells).map(key => {
      return (
        <li onClick={() => this.handleSpellClick(key)} key={spells[key].id}>
          {spells[key].name} ({spells[key].max_dmg} dmg,{" "}
          {spells[key].numberOfSequences} steps)
        </li>
      );
    });
  }

  spellSummaryGamePage() {
    return (
      <Fragment>
        <div>Please select your spell:</div>
        <div>
          <ul>{this.renderSpellItem(this.state.availableSpells)}</ul>
        </div>
      </Fragment>
    );
  }

  render() {
    return (
      <Wrapper>
        <div>Mobile in game</div>
        {this.renderGamePage()}
      </Wrapper>
    );
  }
}
