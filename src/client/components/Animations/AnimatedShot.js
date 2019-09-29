import React, { Component } from "react";
import { Transition } from 'react-transition-group';
import AnimatedImage from "./AnimatedImage"
import {shots} from "./config";
import styled from "styled-components";


const defaultStyle = {
    transition: `all 1000ms ease-in-out`,
    transform: `translateX(0px)`,
};

const transitionStyles = {
  entering:  {
      transition: "all 1000ms ease-in-out",
      transform: "translateX(640px)"
  },
  entered:  { transform: "translateX(640px)" },
  exiting:  {
      transition: "none",
      transform: "translateX(0px)"},
  exited:  { transform: "translateX(0px)"},
};

const ShotWrapper = styled.div`
    position: absolute;
    ${({bottom}) => bottom ? `bottom: ${bottom}px` : `bottom: 20px`}
    ${({left}) => left ? `left: ${left}px` : `left: 20px`}
`;

class AnimatedShot extends Component {
    state = {
        show: false
    };
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return nextProps.update || (this.state.show && !nextState.show)
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.update) {
            this.setState({show: true});
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.state.show){
            setTimeout(() => this.setState({show:false}), 800);
        }
    }

    render() {
      const { show } = this.state;
      const { shotType } = this.props;

      return (
          <ShotWrapper bottom={100} left={100}>
              <Transition in={show} timeout={300}>
                  {state => (
                      <div style={{
                          ...defaultStyle,
                          ...transitionStyles[state]
                      }}>
                          {show &&
                              <AnimatedImage
                                  img={shots[shotType]}
                                  width={100}
                              />
                          }
                      </div>
                  )}
              </Transition>
          </ShotWrapper>
      );
  }
}

export default AnimatedShot
