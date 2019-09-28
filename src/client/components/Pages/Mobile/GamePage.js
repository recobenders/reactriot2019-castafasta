import React, { Component, Fragment } from "react";
import styled from "styled-components";
import Constants from "../../../../shared/constants";
import NameForm from "../../Forms/NameForm";
import Spell from "../../../../shared/spell";

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
      activeCasting: false
    };
  }

  componentDidMount() {
    this.props.socket.on(Constants.MSG.GAME_UPDATE, data => {
      console.log(data);
    });
  }

  handleDamageSubmit(value) {
    let accuracies = value.split(" ");
    this.props.socket.emit(Constants.MSG.CASTING_DONE, accuracies);
  }

  renderGamePage() {
    if (this.state.activeCasting) {
      return this.activeCastingGamePage();
    }
    return this.spellSummaryGamePage();
  }

  activeCastingGamePage() {
    return (
      <Fragment>
        <div>Active Casting</div>
        <NameForm handleFormSubmit={this.handleDamageSubmit.bind(this)} />
      </Fragment>
    );
  }

  renderSpellItem(spells) {
    // spells.map((o, i) => return(<ObjectRow obj={o} key={i})))
    return spells.map(spell => {
      return (
        <li>
          {spell.name} ({spell.max_dmg} dmg, {spell.numberOfSequences} steps)
        </li>
      );
    });
  }

  spellSummaryGamePage() {
    return (
      <Fragment>
        <div>Please select your spell:</div>
        <div>
          <ul>{this.renderSpellItem(Spell.getSpells())}</ul>
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
