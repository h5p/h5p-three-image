export const openSceneContentAppContext = {
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
            "interactionpos": "0,0",
            "action": {
              "library": "H5P.AdvancedText 1.1",
              "params": {
                "text": "<h2>Bjørnstjerne Bjørnson</h2>\n\n<p>Han var en av <a href=\"http://snl.no/Norge\">Norges</a>&nbsp;og <a href=\"http://snl.no/Europa\">Europas</a>&nbsp;viktigste forfattere i andre halvdel av 1800-tallet. Hans produksjon er svært omfattende og inkluderer <a href=\"https://snl.no/roman\">romaner</a>,&nbsp;<a href=\"https://snl.no/novelle\">noveller</a>,&nbsp;<a href=\"https://snl.no/teater\">teaterstykker</a>&nbsp;og <a href=\"https://snl.no/lyrikk\">lyrikk</a>. I tillegg til dette var han også&nbsp;<a href=\"https://snl.no/journalist\">journalist</a>, debattant, teatersjef og <a href=\"https://snl.no/politikk\">politisk</a>&nbsp;aktivist.</p>\n"
              },
              "subContentId": "bbbfb0ce-fd8d-4c8f-8a4b-87f0bf9c3b0d",
              "metadata": {
                "contentType": "Text",
                "license": "U",
                "title": "Untitled Text"
              }
            },
            "label": {
              "labelPosition": "inherit",
              "showLabel": "inherit",
              "showAsHotspot": false,
              "showHotspotOnHover": false,
              "isHotspotTabbable": false,
              "hotSpotSizeValues": "354,222",
              "showAsOpenSceneContent": true
            }
          }
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
