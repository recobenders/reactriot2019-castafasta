import React, { Component } from "react";
import styled from "styled-components";
import Constants from '../../../shared/constants';

const HealthContainer = styled.section`
  background-color: red;
  width: 100%;
  display: block;
`;

const Health = styled.section`
  background-color: green;
  width: ${props => props.hp} %;
  display: block;
  padding: 5px;
`;

class HealthBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hp: props.hp
    };
  }

  render() {
    return (
      <HealthContainer>
        <Health>
          {this.state.hp} / {Constants.PLAYER_MAX_HP}
        </Health>
      </HealthContainer>
    );
  }
}

export default HealthBar;

