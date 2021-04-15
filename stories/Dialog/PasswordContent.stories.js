// @ts-check
import React, {useState} from "react";
import PasswordContent from "../../scripts/components/Dialog/PasswordContent";
import { defaultAppContext } from "../../.storybook/config/contexts";
import { H5PContext } from "../../scripts/context/H5PContext";
export default {
  title: "PasswordContent",
  component: PasswordContent,
  argTypes: {
    children: { control: { disable: true } },
    currentInteraction: {
      unlocked: { control: 'boolean' },
    }
  },
};

const defaultArguments = {
  currentInteraction: {
    unlocked: false,
  },
  currentInteractionIndex: 0,
  showInteraction: () => {},
  handlePassword: () => {},
  hint: '',
};
const Template = (args) => {
  return(
    <H5PContext.Provider value={defaultAppContext}>
      <PasswordContent {...defaultArguments} {...args}/>
    </H5PContext.Provider>
  );
};
export const Empty = Template.bind({});
Empty.args = {};

export const Unlocked = Template.bind({});
Unlocked.args = {
  currentInteraction: {
    unlocked: true
  },
};
export const WithHint = Template.bind({});
WithHint.args = {
  hint: '123',
};
