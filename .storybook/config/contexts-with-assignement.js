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
    userIsAtStartScene: "You are at the start scene",
    unlocked: "Unlocked",
    locked: "Locked",
    searchRoomForCode: "Search the room until you find the code",
    wrongCode: "The code was wrong, try again.",
    contentUnlocked: "The content has been unlocked!",
    code: "Code",
    showCode: "Show code",
    hideCode: "Hide code",
    unlockedStateAction: "Continue",
    lockedStateAction: "Unlock",
    score: "Score",
    total: "Total",
    assignment: "Assignment",
    scoreSummary: "scoreSummary",
    scene: "Scene",
  },
  params: {
    startSceneId: 1,
    scenes: [
      {
        sceneId: 1,
        scenename: "test",
        interactions: [
          {
            label: {
              labelText: "",
              labelPosition: "right",
            },
            action: {
              library: "H5P.GoToScene 0.1",
              params: { nextSceneId: 1 },
              gotoScene: 1,
            },
            interactionpos: "0,0",
          },
        ],
      },
    ],
  },
  contentId: 0,
  extras: {},
  sceneRenderingQuality: "high",
  on: () => undefined,
  getRatio: () => 16 / 9,
  trigger: (eventName, data) => {
    H5P.jQuery("root").trigger(eventName, data);
  },
};
