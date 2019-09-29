import React from "react";
import { storiesOf } from "@storybook/react";
import PlayerInfo from "../src/client/components/Game/PlayerInfo";

export const player = {
  username: "Bot",
  hp: 200
};

storiesOf("Player Info", module)
  .addDecorator(story => (
    <div
      style={{
        width: "50%"
      }}
    >
      {story()}
    </div>
  ))
  .add("default", () => <PlayerInfo player={player} />)
  .add("with tilt", () => <PlayerInfo player={player} tilt />);
