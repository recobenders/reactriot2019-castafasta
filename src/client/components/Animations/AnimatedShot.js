import React, { Component } from "react";
import { Transition } from 'react-transition-group';
import AnimatedImage from "./AnimatedImage"
import {shots} from "./config";


const defaultStyle = {
    transition: `all 1000ms ease-in-out`,
    transform: "translateX(0px)"
};

const transitionStyles = {
  entering:  {
      transition: `all 1000ms ease-in-out`,
      transform: "translateX(640px)"
  },
  entered:  { transform: "translateX(640px)" },
  exiting:  {
      transition: `all 10ms ease-in-out`,
      transform: "translateX(0px)"},
  exited:  { transform: "translateX(0px)"},
};

class AnimatedShot extends Component {
    state = {
        show: false
    };

    componentWillReceiveProps(nextProps, nextContext) {
       if(nextProps.update) {
           this.setState({show:true});
           setTimeout(() => this.setState({show:false}), 800);
       }
  }

    render() {
      const { show } = this.state;
      const { shotType, update } = this.props;
      return (
          <Transition in={show} timeout={300}>
              {state => (
                  <div style={{
                      ...defaultStyle,
                      ...transitionStyles[state]
                  }}>
                      {update && show &&
                          <AnimatedImage
                              img={shots[shotType]}
                              width={100}
                          />
                      }
                  </div>
              )}
          </Transition>
      );
  }
}

export default AnimatedShot
