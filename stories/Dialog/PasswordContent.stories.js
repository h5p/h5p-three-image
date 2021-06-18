// @ts-check
import React from "react";
import { defaultAppContext } from "../../.storybook/config/contexts";
import PasswordContent from "../../scripts/components/Dialog/PasswordContent";
import { H5PContext } from "../../scripts/context/H5PContext";

export default {
  title: "PasswordContent",
  component: PasswordContent,
  argTypes: {
    hint: { control: "text" },
  },
};

const defaultArguments = {
  currentInteraction: { unlocked: false },
  currentInteractionIndex: 0,
  showInteraction: () => {},
  handlePassword: () => {},
  updateEscapeScoreCard: (isUnlocked) => {},
  hint: "",
};

const Template = (args) => {
  const props = {
    ...defaultArguments,
    ...args,
  };

  return (
    <H5PContext.Provider value={defaultAppContext}>
      <PasswordContent {...props} />
    </H5PContext.Provider>
  );
};

export const Empty = Template.bind({});
Empty.args = {};

export const WithHint = Template.bind({});
WithHint.args = {
  hint: "Hint",
};
