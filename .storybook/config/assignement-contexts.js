export const assignmentAppContext = {
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
    total: "Total",
    score: "Score",
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
              labelText: "svar riktig",
              labelPosition: "right",
            },
            action: {
              library: "H5P.SingleChoiceSet 1.11",
              params: { choices: [{}, {}] },
              metadata: {},
            },
            interactionpos: "50,0",
          },
          {
            "interactionpos": "50,50",
            label: {
              labelText: "svar riktig",
              labelPosition: "right",
            },
            "action": {
                "library": "H5P.Summary 1.10",
                "params": {
                    "intro": "<p>Hvor mange bilder er det p\u00e5 veggen?<\/p>\n",
                    "summaries": [
                        {
                            "subContentId": "8442f194-ff46-4a49-9b5e-bb82f8ba4269",
                            "summary": [
                                "<p>1<\/p>\n",
                                "<p>2<\/p>\n",
                                "<p>3<\/p>\n"
                            ],
                            "tip": ""
                        }
                    ],
                    "overallFeedback": [
                        {
                            "from": 0,
                            "to": 99,
                            "feedback": "Feil."
                        },
                        {
                            "from": 100,
                            "to": 100,
                            "feedback": "Korrekt. Det er 3 bilder. Her er koden: 2534"
                        }
                    ],
                    "solvedLabel": "Progress:",
                    "scoreLabel": "Wrong answers:",
                    "resultLabel": "Your result",
                    "labelCorrect": "Correct.",
                    "labelIncorrect": "Incorrect! Please try again.",
                    "alternativeIncorrectLabel": "Incorrect",
                    "labelCorrectAnswers": "Correct answers.",
                    "tipButtonLabel": "Show tip",
                    "scoreBarLabel": "You got :num out of :total points",
                    "progressText": "Progress :num of :total"
                },
                "subContentId": "fe51c9c0-d9a2-41b1-ab45-45936718793c",
                "metadata": {
                    "contentType": "Summary",
                    "license": "U",
                    "title": "Untitled Summary"
                }
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
