import React, { Component } from "react";
import { Row, Col } from "antd";
import _ from "lodash";

import earthStrong from "./assets/earth_strong_2.png";
import earthMedium from "./assets/earth_medium_1.png";
import earthWeak from "./assets/earth_weak_3.png";

import fireStrong from "./assets/fire_strong_2.png";
import fireMedium from "./assets/fire_medium_1.png";
import fireWeak from "./assets/fire_weak_3.png";

import iceStrong from "./assets/ice_strong_2.png";
import iceMedium from "./assets/ice_medium_1.png";
import iceWeak from "./assets/ice_weak_3.png";

import windStrong from "./assets/wind_strong_2.png";
import windMedium from "./assets/wind_medium_1.png";
import windWeak from "./assets/wind_weak_3.png";

import Text from "antd/lib/typography/Text";

class SpellSelector extends Component {
  retrieveIcon(spellKey) {
    let icon;
    switch (spellKey) {
      case "fireBolt":
        icon = fireWeak;
        break;
      case "meteor":
        icon = fireMedium;
        break;
      case "fieryImplosion":
        icon = fireStrong;
        break;
      case "glacialTouch":
        icon = iceWeak;
        break;
      case "iceCrash":
        icon = iceMedium;
        break;
      case "frostSpike":
        icon = iceStrong;
        break;
      case "whirlingBlades":
        icon = windWeak;
        break;
      case "shredder":
        icon = windMedium;
        break;
      case "tornado":
        icon = windStrong;
        break;
      case "boulderSlam":
        icon = earthWeak;
        break;
      case "talonsFromThePast":
        icon = earthMedium;
        break;
      case "titanClap":
        icon = earthStrong;
        break;
      default:
        icon = fireWeak;
    }
    return icon;
  }

  renderSpellItem(spell) {
    return (
      <Col span={6}>
        <div
          onClick={() => this.props.handleSpellSelected(spell.key)}
          key={spell.id}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <div
            style={{
              background:
                "linear-gradient(to right,  #0f0c29, #302b63, #24243e)",
              borderRadius: "6px",
              boxShadow: "2px 2px 3px #000000"
            }}
          >
            <img
              src={this.retrieveIcon(spell.key)}
              width="65"
              height="65"
              alt={spell.key}
            />
          </div>
          <div style={{ textAlign: "center" }}>
            <Text strong>{spell.name}</Text>
          </div>
        </div>
      </Col>
    );
  }

  render() {
    let preparedPairs = _.chunk(this.props.spells, 3);
    let spellRows = preparedPairs.map(triplet => {
      return (
        <Row justify="space-around" type="flex" style={{ minHeight: "110px" }}>
          {this.renderSpellItem(triplet[0])}
          {this.renderSpellItem(triplet[1])}
          {this.renderSpellItem(triplet[2])}
        </Row>
      );
    });

    return <div style={{ width: "100%" }}>{spellRows}</div>;
  }
}

export default SpellSelector;
