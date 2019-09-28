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
    const { img } = this.props;
    let position = img["width"];
    const interval = img["interval"];
    setInterval(()=> {
      this.imageRef.current.style.backgroundPosition = `-${position}px 0px`;

      if(position < img["width"]*img["slices"]){
        position += img["width"];
      } else {
        position = 0;
      }
    }, interval);
  }


  render() {
      const { img } = this.props;
      console.log(img)
      return (
        <AnimatedImageWrapper
            url={img["source"]}
            width={img["width"]}
            height={img["height"]}
            ref={this.imageRef}
        />
      );
  }
}

export default AnimatedImage
