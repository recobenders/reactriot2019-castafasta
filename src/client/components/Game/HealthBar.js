import React, { Component } from "react";
import styled from "styled-components";
import Constants from '../../../shared/constants';

const Health = styled.div`
  ${({hp}) => `width: ${(hp / Constants.PLAYER_MAX_HP) * 100}%;`}
  background-color: green;
  display: block;
  padding: 5px;
  overflow: visible;
  ${({tilt}) => tilt && `
    text-align: right;
    margin-left: auto;
  `}
`;

const HealthContainer = styled.section`
  background-color: red;
  width: 100%;
  display: block;
`;

class HealthBar extends Component {
  render() {
    const { hp, tilt } = this.props;

    return (
      <HealthContainer>
        <Health hp={hp} tilt={tilt} >
          {hp} / {Constants.PLAYER_MAX_HP}
        </Health>
      </HealthContainer>
    );
  }
}

export default HealthBar;

