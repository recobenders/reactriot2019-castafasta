import React, { Component } from "react";
import HealthBar from "./HealthBar";

class PlayerInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      player: props.player
    };
  }

  render() {
    return (
      <div>
        <div>{this.state.player.username}</div>
        <HealthBar hp={this.state.player.hp} />
      </div>
    );
  }
}

export default PlayerInfo;

