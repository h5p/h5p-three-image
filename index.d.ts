declare type SceneParams = {
  sceneId: number;
  interactions: Interaction[];
  cameraStartPosition: string;
  sceneType: "360" | "static" | null;
  scenename: string;
  iconType?: string;
};

declare type Interaction = {
  interactionpos: string;
  action: Action;
  labelText: string;
  label?: InteractionLabel;
  iconTypeTextBox?: string;
  id: string;
  unlocked?: boolean;
  isAnswered?: boolean; 
};

declare type InteractionLabel = {
  labelText?: string;
  hotSpotSizeValues: string;
  isHotspotTabbable: boolean;
  labelPosition: string;
  showAsHotspot: boolean;
  showAsOpenSceneContent: boolean;
  showHotspotOnHover: boolean;
  showLabel: string;
  interactionPassword?: string;
};

declare type Action = {
  library: string;
  params: {
    nextSceneId?: number | string;
    title?: string;
    text?: string;
    alt?: string;
  };
  metadata: {
    title: string;
  }
};

declare type CameraPosition = {
  yaw: number;
  pitch: number;
};

declare type Library = {
  uberName: string;
}

declare type ScenePreview = {
  getCamera: () => {
    camera: CameraPosition;
    fov: number;
  }
}

declare const H5P: any;

declare type H5PEvent = {
  data: any;
  defaultPrevented: boolean;
  getBubbles: () => boolean;
  preventBubbling: () => void;
  scheduleForExternal: () => void;
  type: string;
};

declare type ScoreCard = {
  numQuestionsInTour: number,
  totalQuestionsCompleted: number,
  totalCodesEntered: number,
  totalCodesUnlocked: number,
  sceneScoreCards: Record<number, SceneScoreCard>;
};

declare type SceneScoreCard = {
  title: string;
  numQuestionsInScene: number;
  scores: Record<number, SceneScoreCardScore>;
};

declare type SceneScoreCardScore = {
  title: string;
  raw: number;
  max: number;
  scaled: number;
};
