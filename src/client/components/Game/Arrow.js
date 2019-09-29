import React, { Component } from "react";
import { Icon } from "antd";

class Arrow extends Component {
  render() {
    const { direction } = this.props;
    
    let arrowType = null;
    switch (direction) {
      case 0:
        arrowType = "arrow-up";
        break;
      case 1:
        arrowType = "arrow-down";
        break;
      case 2:
        arrowType = "arrow-right";
        break;
      case 3:
        arrowType = "arrow-left";
        break;
      default:
        return;
    }

    return (
      <Icon type={arrowType} />
    );
  }
}

export default Arrow;

