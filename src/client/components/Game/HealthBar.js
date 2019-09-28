import React, { Component } from "react";
import Constants from '../../../shared/constants';

class HealthBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hp: props.hp
    };
  }

  render() {
    return (
      <div>
        HP: {this.state.hp} / {Constants.PLAYER_MAX_HP}
      </div>
    );
  }
}

export default HealthBar;

