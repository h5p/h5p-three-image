import React from "react";
import Dialog from "../../scripts/components/Dialog/Dialog";
import { defaultAppContext } from "../../.storybook/config/contexts";
import { H5PContext } from "../../scripts/context/H5PContext";

export default {
  title: "Dialog",
  component: Dialog,
  argTypes: {
    children: { control: { disable: true } },
  },
};

const defaultArguments = {
  dialogClasses: [],
  onHideTextDialog: () => undefined,
  children: <div></div>,
};

const Template = (args) => (
  <H5PContext.Provider value={defaultAppContext}>
    <Dialog {...defaultArguments} {...args}></Dialog>
  </H5PContext.Provider>
);

export const Empty = Template.bind({});
Empty.args = {};

export const Test = Template.bind({});
Test.args = {
  children: <div>Test</div>,
};
export const Test2 = Template.bind({});
Test2.args = {
  children: <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo vel, aspernatur eius omnis ipsam, modi est, iusto obcaecati voluptatem excepturi soluta molestiae ea saepe. Iusto asperiores alias impedit, dolore harum.</div>,
};
