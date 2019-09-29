import React, { Component, Fragment } from "react";
import styled from "styled-components";
import Constants from "../../../shared/constants";
import Text from "antd/lib/typography/Text";

const Health = styled.div`
  ${({ hp }) => `width: ${(hp / Constants.PLAYER_MAX_HP) * 100}%;`}
  background-color: green;
  display: block;
  height: 31px
  overflow: visible
`;

const Hp = styled.section`
  height: 31px
  color: white
  width: auto;
  display: flex
  position: absolute
  left: 10px
  align-items: center
  z-index: 10
  font-weight: bold
  text-shadow: 2px 2px 3px #000000
`;

const HealthContainer = styled.section`
  background-color: red;
  width: 100%;
  display: block;
  position: relative;
`;

class HealthBar extends Component {
  render() {
    const { hp, tilt } = this.props;

    return (
      <div>
        <Hp>
          <span>
            {hp} / {Constants.PLAYER_MAX_HP}
          </span>
        </Hp>
        <HealthContainer ref={this.refCallback}>
          <Health hp={hp}></Health>
        </HealthContainer>
      </div>
    );
  }
}

export default HealthBar;
