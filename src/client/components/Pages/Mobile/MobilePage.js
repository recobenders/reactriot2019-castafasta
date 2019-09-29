import React, { Component } from "react";
import { withCookies } from "react-cookie";
import styled from "styled-components";
import NameForm from "../../Forms/NameForm";
import Constants from "../../../../shared/constants";
import Title from "antd/lib/typography/Title";
import wandBlue from "../../Game/assets/wiz_wand_blue.png";
import wandRed from "../../Game/assets/wiz_wand_red.png";

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  pagination: 10px;
`;

const ImagesRow = styled.div`
  display: flex,
  justify-content: space-around;
  margin-bottom: 20px;
  align-items: flex-end
`;

const Image = styled.img`
    width: 80px;
    ${({left}) => `transform: rotate(${left ? -40 : 40}deg) translate(${left ? 20 : -20}px)`};
`;

class MobilePage extends Component {
  constructor(props) {
    super(props);

    if (!window.DeviceOrientationEvent || !('ontouchstart' in window))
    {
      this.props.history.push({
        pathname: "/error",
        state: {
          message: "Your device or browser does not support orientation events. Try a different web browser.",
          flair: "A true Casta need a true wand-a."
        }
      });
    }
    
    const { cookies } = props;
    this.state = {
      userName: cookies.get("user_name")
    };

    this.props.socket.on(Constants.MSG.WAITING_FOR_GAME, () => {
      this.props.history.push("/mobile/waiting");
    });
  }

  handleFormSubmit(name, type) {
    const { cookies } = this.props;
    cookies.set("user_name", name);
    let singlePlayer = type === "singleplayer";
    this.props.socket.emit(Constants.MSG.NEW_PLAYER, {
      uuid: this.props.match.params.userId,
      name: name,
      singlePlayer: singlePlayer
    });
  }

  render() {
    return (
      <Wrapper>
        <ImagesRow>
          <Image src={wandRed} left/>
          <Image src={wandBlue}/>
        </ImagesRow>
        <Title level={2} style={{fontFamily: "OurFont", fontSize: "4em", fontWeight: 5}}>Hello, I am your wand!</Title>
        <NameForm
          handleFormSubmit={this.handleFormSubmit.bind(this)}
          userName={this.state.userName}
        />
      </Wrapper>
    );
  }
}

export default withCookies(MobilePage);
