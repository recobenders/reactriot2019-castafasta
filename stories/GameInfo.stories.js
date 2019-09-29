import React from "react";
import { storiesOf } from "@storybook/react";
import GameInfo from "../src/client/components/Game/GameInfo";
import { player } from "./PlayerInfo.stories";

const game = {
  roundTime: 100,
  playerOne: player,
  playerTwo: {
    username: "Test Very long name",
    hp: 100
  }
};

storiesOf("GameInfo", module).add("default", () => <GameInfo game={game} />);
