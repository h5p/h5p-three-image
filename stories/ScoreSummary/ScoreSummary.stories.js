// @ts-check
import React from "react";
import { defaultAppContext } from "../../.storybook/config/contexts";
import ScoreSummary from "../../scripts/components/Dialog/ScoreSummary";
import { H5PContext } from "../../scripts/context/H5PContext";

export default {
  title: "ScoreSummary",
  component: ScoreSummary,
  argTypes: {
    hint: { control: "text" },
  },
};

const defaultArguments = {
  currentInteraction: { unlocked: false },
  currentInteractionIndex: 0,
  showInteraction: () => {},
  handlePassword: () => {},
  hint: "",
};

const Template = (args) => {
  const props = {
    ...defaultArguments,
    ...args,
  };

  return (
    <H5PContext.Provider value={defaultAppContext}>
      <ScoreSummary {...props}></ScoreSummary>
    </H5PContext.Provider>
  );
};

export const Empty = Template.bind({});
Empty.args = {scores: {
  "0": {
    "0": {
      "min": 0,
      "max": 1,
      "raw": 1,
      "scaled": 1
    },
    "1": {
      "min": 0,
      "max": 1,
      "raw": 0,
      "scaled": 0
    }
  },
  "1": {
    "0": {
      "min": 0,
      "max": 2,
      "raw": 1,
      "scaled": 0.5
    }
  }
}};

