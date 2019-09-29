import React from "react";
import { storiesOf } from "@storybook/react";
import SpellSelector from "../src/client/components/Game/SpellSelector";
import Spell from "../src/server/spell";

import { action } from "@storybook/addon-actions";

export const actions = {
  handleSpellSelected: action("handleSpellSelected")
};

const spells = Object.values(Spell.getSpells());

storiesOf("SpellSelector", module)
  .addDecorator(story => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh"
      }}
    >
      {story()}
    </div>
  ))
  .add("default", () => <SpellSelector spells={spells} {...actions} />);
