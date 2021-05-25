import React from "react";
import Main from "../../scripts/components/Main";
import { defaultAppContext } from "../../.storybook/config/contexts";
import { H5PContext } from "../../scripts/context/H5PContext";
import NoScene from "../../scripts/components/Scene/NoScene";

export default {
  title: "NoScene",
  component: NoScene,
  argTypes: {
    backgroundColor: { control: "color" },
    label: {type: "string"}
  },
};



const Template = (args) => (
  <H5PContext.Provider value={defaultAppContext}>
    <Main {...args}>
      <NoScene {...args}></NoScene>
    </Main>
  </H5PContext.Provider>
);

export const No_Scene = Template.bind({});
No_Scene.args = {
  label: "test",
  forceStartScreen: undefined,
  forceStartCamera: undefined,
  currentScene: 0,
  showSceneDescriptionInitially: false,
  setCurrentSceneId: 0,
  addThreeSixty: (tS) => undefined,
  onSetCameraPos: () => undefined,
};
