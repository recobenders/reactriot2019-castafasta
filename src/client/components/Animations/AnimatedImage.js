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
  imageRef;
  width;
  height;

  constructor(props){
    super(props);
    this.imageRef = React.createRef();
    const { width, height, img } = props;
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

    this.animation = setInterval(() => {
        this.imageRef.current.style.backgroundPosition = `-${position}px 0px`;

        if (position < this.width * img["slices"]) {
          position += this.width;
        }  else {
          this.imageRef.current.style.backgroundPosition = `0px 0px`;
          clearInterval(this.animation)
        }
      }, interval);
  };

  componentDidUpdate(prevProps, prevState, s) {
    const { img, repeat, repeatInterval } = this.props;
    if (prevProps.img !== img || prevProps.repeat !== repeat) {
      this.animate();
      clearInterval(this.repetition);
      if (repeat) {
        this.repetition = setInterval(this.animate, repeatInterval ? repeatInterval : 10000)
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.animationIntervalId);
  }

  render() {
      const { img } = this.props;
      return (
        <AnimatedImageWrapper
            url={img["source"]}
            width={this.width}
            backgroundWidth={this.width*img["slices"]}
            height={this.height}
            ref={this.imageRef}
        />
      );
  }
}

export default AnimatedImage
