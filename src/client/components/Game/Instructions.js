import React, { Component } from "react";
import Arrow from './Arrow'

class Instructions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      castingSpell: (props.spell && props.spell.requiredSequences[props.spell.capturedAccuracy.length])
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      castingSpell: (nextProps.spell && nextProps.spell.requiredSequences[nextProps.spell.capturedAccuracy.length])
    });
  }

  render() {
    if (!this.state.castingSpell) return(<></>);

    const { spell } = this.props;
    const direction = spell.requiredSequences[spell.capturedAccuracy.length];

    return (
      <Arrow direction={direction} />
    );
  }
}

export default Instructions;

