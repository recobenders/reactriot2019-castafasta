import React from "react";
import { storiesOf } from "@storybook/react";
import HealthBar from "../src/client/components/Game/HealthBar";
import { withKnobs, number } from "@storybook/addon-knobs";

storiesOf("HealthBar", module)
  .addDecorator(withKnobs)
  .addDecorator(story => (
    <div
      style={{
        width: "50%"
      }}
    >
      {story()}
    </div>
  ))
  .add("default", () => <HealthBar hp={500} tilt />)
  .add("without tilt", () => <HealthBar hp={number("hp", 100)} />)
  .add("low hp", () => <HealthBar hp={40} />);
