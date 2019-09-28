import React, { Component } from "react";
import styled from "styled-components";

const AnimatedImageWrapper = styled.div`
${({width, height, url}) => `
    width: ${width}px;
    height: ${height}px;
    background: url('${url}') 0px 0px`
}
`;

class AnimatedImage extends Component {
  imageRef;

  constructor(props){
    super(props);
    this.imageRef = React.createRef();
  }

  componentDidMount() {
    const { image } = this.props;
    let position = image["width"];
    const interval = image["width"];
    setInterval(()=> {
      this.imageRef.current.style.backgroundPosition = `-${position}px 0px`;

      if(position < image["width"]+image["slices"]){
        position += image["width"];
      } else {
        position = 0;
      }
    }, interval);
  }


  render() {
      const { image } = this.props;
      return (
        <AnimatedImageWrapper
            url={image["source"]}
            width={image["width"]}
            height={image["height"]}
            ref={this.imageRef}
        />
      );
  }
}

export default AnimatedImage
