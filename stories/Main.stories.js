import React from "react";
import Main from "../scripts/components/Main";
import { defaultAppContext } from "../.storybook/config/contexts";
import { H5PContext } from "../scripts/context/H5PContext";

export default {
  title: "Main",
  component: Main,
  argTypes: {
    backgroundColor: { control: "color" },
  },
};

const Template = (args) => (
  <H5PContext.Provider value={defaultAppContext}>
    <Main {...args} />
  </H5PContext.Provider>
);

export const Empty = Template.bind({});
Empty.args = {
  forceStartScreen: undefined,
  forceStartCamera: undefined,
  currentScene: 0,
  setCurrentSceneId: 0,
  addThreeSixty: (tS) => undefined,
  onSetCameraPos: () => undefined,
};
