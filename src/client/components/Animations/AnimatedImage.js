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

  componentDidMount() {
    const { img } = this.props;
    let position = this.widows;
    const interval = img["interval"];
    setInterval(()=> {
      this.imageRef.current.style.backgroundPosition = `-${position}px 0px`;

      if(position < this.width*img["slices"]){
        position += this.width;
      } else {
        position = 0;
      }
    }, interval);
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
