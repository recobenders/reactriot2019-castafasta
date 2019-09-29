import React, { Component, Fragment } from "react";
import HealthBar from "./HealthBar";
import styled from "styled-components";
import Title from "antd/lib/typography/Title";
import { Row } from "antd";

const TitleWrapper = styled.div`
  ${({ tilt }) => tilt && `margin-left: auto;`};
`;

class PlayerInfo extends Component {
  render() {
    const { tilt } = this.props;
    return (
      <Fragment>
        <Row type="flex">
          <TitleWrapper tilt={tilt}>
            <Title level={3}>{this.props.player.username}</Title>
          </TitleWrapper>
        </Row>
        <Row>
          <HealthBar hp={this.props.player.hp} tilt={tilt} />
        </Row>
      </Fragment>
    );
  }
}

export default PlayerInfo;
