import React, { Component } from "react";
import styled from "styled-components";
import Constants from '../../../shared/constants';

const Health = styled.div`
  background-color: green;
  display: block;
  padding: 5px;
`;

const HealthContainer = styled.section`
  background-color: red;
  width: 100%;
  display: block;
`;

class HealthBar extends Component {
  render() {
    const { hp } = this.props;
    const divStyle = { // FIXME: I couldn't figure out how to access props in a styled component.
      width: (hp / Constants.PLAYER_MAX_HP) * 100 + '%'
    };

    return (
      <HealthContainer>
        <Health style={divStyle}>
          {hp} / {Constants.PLAYER_MAX_HP}
        </Health>
      </HealthContainer>
    );
  }
}

export default HealthBar;

