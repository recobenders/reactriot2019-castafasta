import React, { Component } from "react";
import styled from "styled-components";

const AnimatedImageWrapper = styled.div`
${({width, height, url, backgroundWidth}) => `
    width: ${width}px;
    height: ${height}px;
    background: url('${url}') 0px 0px;
    background-size: ${backgroundWidth}px ${height}px;
    `
}
`;

class AnimatedImage extends Component {

  constructor(props){
    super(props);
    const { width, height, img } = props;
    this.ref = React.createRef();
    if (width) {
        this.width = width;
        if(height){
          this.height = height;
        } else {
          this.height = Math.round((width*img["height"])/img["width"])
        }
      } else if (height) {
        this.height = height;
        this.width = Math.round((height*img["width"])/img["height"])
      } else {
        this.width = img["width"];
        this.height = img["height"];
      }
  }

  animate = () => {
    const { img } = this.props;

    let position = 0;
    const interval = img["interval"];

    clearInterval(this.animation);

    this.animationId = setInterval(() => {
      if (this.ref.current) return;
      this.ref.current.style.backgroundPosition = `-${position}px 0px`;

      if (position < this.width * img["slices"]) {
        position += this.width;
      } else {
        this.ref.current.style.backgroundPosition = `0px 0px`;
        clearInterval(this.animationId);
      }
    }, interval);
  };

  componentDidMount() {
    this.animate();
  }

  componentDidUpdate(prevProps, prevState, s) {
    const { repeat, repeatInterval } = this.props;
      clearInterval(this.repetitionId);
      clearInterval(this.animationId);
      this.animate();
      if (repeat) {
        this.repetitionId = setInterval(this.animate, repeatInterval ? repeatInterval : 10000)
      }
  }

  componentWillUnmount() {
    clearInterval(this.animationId);
    clearInterval(this.repetitionId);
  }

  render() {
      const { img } = this.props;
      return (
        <AnimatedImageWrapper
            url={img["source"]}
            width={this.width}
            backgroundWidth={this.width*img["slices"]}
            height={this.height}
            ref={this.ref}
        />
      );
  }
}

export default AnimatedImage
