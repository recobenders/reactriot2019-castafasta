import React, { Component } from "react";
import styled from "styled-components";
import wizard from "./wizard.png"

const Wrapper = styled.section`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const AnimatedImage = styled.div`
    width: 624px;
    height: 500px;
    background: url('${wizard}') 0px 0px;
`;

class GamePage extends Component {
  imageRef;

  constructor(props){
    super(props);
    this.imageRef = React.createRef();
  }

  componentDidMount() {
    console.log(this.imageRef.current)
    let position = 624;
    const interavl = 150;
    setInterval(()=> {
      this.imageRef.current.style.backgroundPosition = `-${position}px 0px`

      if(position < 4368){
        position += 624;
      } else {
        position = 0;
      }
    }, interavl);
  }


  render() {
    return (
      <Wrapper>
          <AnimatedImage url={wizard} ref={this.imageRef}/>
      </Wrapper>
    );
  }
}

export default GamePage;
