interface ServerChatRoomCustomData {
  WormholeList: {
    Coords: { X: number, Y: number, RoomName: string }[];
    ChatTriggers: { TriggerWord: string, RoomName: string }[];
    Teleports: { X: number, Y: number, TargetX: number, TargetY: number, backWards: boolean }[];
  },
}

interface Window {
  wormHoleSearch: boolean;
  teleportedByWormhole: boolean;
  fixedCustomSettings: boolean;
  changeDone: boolean;
  serverAnswered: boolean;
  oldRoomName: string;
  oldRoomSpace: any;
  targetedRoom: string;
  WHdebugMode: boolean;
  backwardsPortalImage?: HTMLImageElement;
  backwardsPortalImageReady?: boolean;
  startingPortalImage?: HTMLImageElement;
  startingPortalImageReady?: boolean;
  targetPortalImage?: HTMLImageElement;
  targetPortalImageReady?: boolean;
  roomWormholeImage?: HTMLImageElement;
  roomWormholeImageReady?: boolean;
  WormholesBackground: string;
  WormholesRun: () => void;
  WormholesLoad: () => void;
  WormholesUnload: () => void;
  WormholesClick: () => void;
  WormholesExit: () => void;
  WormholesDraw: () => void;
  WormholeDraw: (
        mapX: number,
        mapY: number,
        x: number,
        y: number,
        width: number,
        height: number
      ) => void;
}

interface CharacterOnlineSharedSettings {
  WormholeTriggers?: {
    TeleportsTrigger: boolean;
    ChatTriggersTrigger: boolean;
    CoordsTrigger: boolean;
  };
}