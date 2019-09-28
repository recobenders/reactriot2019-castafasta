import React, { Component } from "react";
import styled from "styled-components";
import Constants from "../../../../shared/constants";
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

export class GamePage extends Component {
  imageRef;

  constructor(props){
    super(props);
    this.imageRef = React.createRef();
  }

  componentDidMount() {
    this.props.socket.on(Constants.MSG.GAME_UPDATE, () => {
      console.log('Received game update');
    });

    console.log(this.imageRef.current);
    let position = 624;
    const interval = 150;
    setInterval(()=> {
      this.imageRef.current.style.backgroundPosition = `-${position}px 0px`

      if(position < 4368){
        position += 624;
      } else {
        position = 0;
      }
    }, interval);
  }


  render() {
    return (
      <Wrapper>
        <AnimatedImage url={wizard} ref={this.imageRef}/>
      </Wrapper>
    );
  }
}
