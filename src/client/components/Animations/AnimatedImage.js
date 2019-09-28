import React, { Component } from "react";
import styled from "styled-components";
import {wizards} from "./config";

const AnimatedImageWrapper = styled.div`
    width: 624px;
    height: 500px;
    background: ${({ url }) => `url('${url}') 0px 0px`};
`;

class AnimatedImage extends Component {
  imageRef;

  constructor(props){
    super(props);
    this.imageRef = React.createRef();
  }

  componentDidMount() {
    let position = 624;
    const interval = 150;
    setInterval(()=> {
      this.imageRef.current.style.backgroundPosition = `-${position}px 0px`;

      if(position < 4368){
        position += 624;
      } else {
        position = 0;
      }
    }, interval);
  }


  render() {
    return (
        <AnimatedImageWrapper url={wizards["red"]["attack"]["source"]} ref={this.imageRef}/>
    );
  }
}

export default AnimatedImage
