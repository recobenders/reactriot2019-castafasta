import React from "react";
import { storiesOf } from "@storybook/react";
import HealthBar from "../src/client/components/Game/HealthBar";

storiesOf("HealthBar", module)
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
  .add("without tilt", () => <HealthBar hp={500} />)
  .add("low hp", () => <HealthBar hp={40} />);
