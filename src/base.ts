export default class WHBase {

    constructor() {
        window.wormHoleSearch = false;
        window.teleportedByWormhole = false;
        window.fixedCustomSettings = false;
        window.changeDone = false;
        window.serverAnswered = true;
        window.oldRoomName = "";
        window.oldRoomSpace = undefined;
        window.targetedRoom = "";
        window.WHdebugMode = false;
    }

    private WHdebugLog(message: string): void {
        if (window.WHdebugMode) {
            console.log(message);
        }
    }


}