import React, { Component } from "react";
import { Row, Col } from "antd";
import _ from "lodash";
import icon from "./assets/spell_fire_fireball.jpg";
import Text from "antd/lib/typography/Text";

class SpellSelector extends Component {
  renderSpellItem(spell) {
    return (
      <Col span={4}>
        <div
          onClick={() => this.props.handleSpellSelected(spell.key)}
          key={spell.id}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <img src={icon} width="70" height="70" alt="fireball" />
          <Text strong>{spell.name}</Text>
        </div>
      </Col>
    );
  }

  render() {
    console.log(this.props.spells);

    let preparedPairs = _.chunk(this.props.spells, 2);
    console.log(preparedPairs.length);
    let spellRows = preparedPairs.map(pair => {
      return (
        <Row justify="center" type="flex" gutter={120}>
          {this.renderSpellItem(pair[0])}
          {this.renderSpellItem(pair[1])}
        </Row>
      );
    });

    return <div style={{ width: "100%" }}>{spellRows}</div>;
  }
}

export default SpellSelector;
