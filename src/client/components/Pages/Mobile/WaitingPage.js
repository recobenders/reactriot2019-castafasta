import React, { Component } from "react";
import styled from "styled-components";
import { Spin } from "antd";
import Title from "antd/lib/typography/Title";
import Constants from "../../../../shared/constants";
import wandRed from "../../Game/assets/wiz_wand_red.png";
import wandBlue from "../../Game/assets/wiz_wand_blue.png";

const Wrapper = styled.section`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`;
const ImagesRow = styled.div`
  display: flex,
  justify-content: space-around;
  margin-bottom: 10px;
  align-items: flex-end
`;

const Image = styled.img`
    width: 80px;
    ${({left}) => `transform: rotate(${left ? -40 : 40}deg) translate(${left ? 20 : -20}px)`};
`;

export class WaitingPage extends Component {
  constructor(props) {
    super(props);

    this.props.socket.on(Constants.MSG.GAME_JOINED, () => {
      console.log('Joining game');
      this.props.history.push("/game/controller");
    });
  }

  render() {
    return(
      <Wrapper>
        <ImagesRow>
          <Image src={wandRed} left/>
          <Image src={wandBlue}/>
        </ImagesRow>
        <Title level={2} style={{marginBottom: "30px"}}>Waiting for Duel oponent</Title>
        <Spin/>
      </Wrapper>
  );
  }
}
