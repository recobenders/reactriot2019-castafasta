import React, { Component } from "react";
import styled from "styled-components";
import Constants from "../../../shared/constants";

const Health = styled.div`
  ${({ hp }) => `width: ${(hp / Constants.PLAYER_MAX_HP) * 100}%;`}
  background-color: green;
  display: block;
  height: 40px
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  overflow: visible
  transition: width .5s
  }
`;

const Hp = styled.section`
  height: 40px
  color: white
  width: auto;
  display: flex
  position: absolute
  left: 10px
  align-items: center
  z-index: 10
  font-weight: bold
  font-size: 1.2em
  text-shadow: 2px 2px 3px #000000
`;

const HealthContainer = styled.section`
  background-color: red;
  width: 100%;
  display: block;
  border-radius: 5px;
  position: relative;
`;

class HealthBar extends Component {
  render() {
    const { hp } = this.props;

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
