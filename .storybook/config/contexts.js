export const defaultAppContext = {
  forceStartScreen: null,
  forceStartCamera: null,
  behavior: {},
  l10n: {
    // Text defaults from app.js
    title: "Interactive Explorer",
    playAudioTrack: "Play Audio Track",
    pauseAudioTrack: "Pause Audio Track",
    sceneDescription: "Scene Description",
    resetCamera: "Reset Camera",
    submitDialog: "Submit Dialog",
    closeDialog: "Close Dialog",
    expandButtonAriaLabel: "Expand the visual label",
    goToStartScene: "Go to start scene",
  },
  params: {},
  contentId: 0,
  extras: {},
  sceneRenderingQuality: "high",
  on: () => undefined,
};
