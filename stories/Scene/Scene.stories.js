import React from "react";
import Main from "../../scripts/components/Main";
import { defaultAppContext } from "../../.storybook/config/contexts";
import { H5PContext } from "../../scripts/context/H5PContext";
import Scene from "../../scripts/components/Scene/Scene";
import imageScene from "../static/alem-omerovic-2W3HhsqKHt8-unsplash.jpg";

const appContext = { ...defaultAppContext };
appContext.params.scenes[0] = {
  ...appContext.params.scenes[0],
  scenesrc: { path: imageScene },
  cameraStartPosition: "0,0",
};

export default {
  title: "Scene",
  component: Scene,
  argTypes: {
    label: { type: "string" },
  },
};

const Template = (args) => (
  <H5PContext.Provider value={appContext}>
    <Main {...args}>
      <Scene {...args}></Scene>
    </Main>
  </H5PContext.Provider>
);

export const SceneStory = Template.bind({});
SceneStory.args = {
  label: "test",
  forceStartScreen: undefined,
  forceStartCamera: undefined,
  currentScene: 1,
  setCurrentSceneId: 1,
  imageSrc: {
    path: imageScene,
  },
  addThreeSixty: (tS) => undefined,
  onSetCameraPos: () => undefined,
};
