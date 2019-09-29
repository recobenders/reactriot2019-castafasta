import React, { Component } from "react";
import HealthBar from "./HealthBar";
import styled from "styled-components";
import Title from "antd/lib/typography/Title";

const Wrapper = styled.section`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const TitleWrapper = styled.div`
  ${({tilt}) => tilt && `margin-left: auto;`}
`;

class PlayerInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      player: props.player
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      player: nextProps.player
    });
  }

  render() {
    const { tilt } = this.props;

    return (
      <Wrapper>
        <TitleWrapper tilt={tilt}>
          <Title level={3}>{this.state.player.username}</Title>
        </TitleWrapper>
        <HealthBar hp={this.state.player.hp} tilt={tilt} />
      </Wrapper>
    );
  }
}

export default PlayerInfo;

