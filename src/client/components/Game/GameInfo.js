import React, { Component } from "react";
import PlayerInfo from "./PlayerInfo";

class GameInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playerOne: props.game.playerOne,
      playerTwo: props.game.playerTwo
    };
  }

  render() {
    return (
      <div>
        <PlayerInfo player={this.state.playerOne} />
        <PlayerInfo player={this.state.playerTwo} />
      </div>
    );
  }
}

export default GameInfo;

