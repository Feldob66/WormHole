import bcModSDK from './bcmodsdk';
import Wormhole from './modules/wormhole';

const VERSION = "0.0.0.1";
const NAME = "wormhole";
const NICKNAME = "Wormhole";

const WH_API = bcModSDK.registerMod({
    name: NICKNAME,
    fullname: NAME,
    version: VERSION,
    repostitory: "",
});

const WORMHOLE = new Wormhole();

//command for registering a coordinate wormhole
CommandCombine([{
    Tag: 'whcoord',
    Description: "[X] [Y] [RoomName]: Register a coordinate wormhole at X,Y that leads to RoomName",
    Action: args => {
        WORMHOLE.whcoord(args);
    }
}]);

//command for registering a chat trigger wormhole
CommandCombine([{
    Tag: 'whchat',
    Description: "[TriggerWord] [RoomName]: Register a chat trigger that sends to RoomName when TriggerWord is said",
    Action: args => {
        WORMHOLE.whchat(args);
    }
}]);

//command for registering a teleport wormhole
CommandCombine([{
    Tag: 'whteleport',
    Description: "[X] [Y] [TargetX] [TargetY] [backwards?]: Register a teleport from X,Y to TargetX,TargetY. Optional 'true' for two-way",
    Action: args => {
        WORMHOLE.whteleport(args);
    }
}]);

//command for toggling wormhole trigger bools
CommandCombine([{
    Tag: 'whtrigger',
    Description: "[type] [true/false]: Toggle specific wormhole type. Types: coords, teleports, chat",
    Action: args => {
        
    }
}]);
//command for removing a wormhole
CommandCombine([{
    Tag: 'whremove',
    Description: "[type] [identifier]: Remove a wormhole. Type: coords, teleports, chat",
    Action: args => {
        const splitArgs = args.split(" ");
        if (splitArgs.length < 2) {
            ChatRoomSendLocal("Usage: /whremove [type] [identifier]\nTypes: coords, teleports, chat\nIdentifier format depends on type:\ncoords: X Y\nteleports: X Y\nchat: triggerword");
            return;
        }

        const type = splitArgs[0].toLowerCase();
        if (!["coords", "teleports", "chat"].includes(type)) {
            ChatRoomSendLocal("Invalid type. Use: coords, teleports, or chat");
            return;
        }

        if (!ChatRoomData?.Admin?.includes(Player.MemberNumber)) {
            ChatRoomSendLocal("You need to be an admin to remove wormholes");
            return;
        }

        // Initialize data structure and validate existing entries
        initializeWormholeType(type === "chat" ? "ChatTriggers" : (type === "coords" ? "Coords" : "Teleports"));
        window.fixedCustomSettings = false;

        switch (type) {
            case "coords": {
                if (splitArgs.length < 3) {
                    ChatRoomSendLocal("For coords type, provide X and Y coordinates");
                    return;
                }
                const X = parseInt(splitArgs[1], 10);
                const Y = parseInt(splitArgs[2], 10);
                let Coords = ChatRoomData?.Custom?.WormholeList?.Coords;
                if (!Coords) {
                    ChatRoomSendLocal("No coordinate wormholes found", 6600);
                    return;
                }
                // Validate all entries first
                for (let W in Coords) {
                    if (!isValidCoord(Coords[W])) {
                        delete Coords[W];
                        window.fixedCustomSettings = true;
                    }
                }
                const index = Coords.findIndex(e => e.X === X && e.Y === Y);
                if (index === -1) {
                    ChatRoomSendLocal(`No wormhole found at coordinates (${X},${Y})`);
                    return;
                }
                Coords.splice(index, 1);
                break;
            }
            case "teleports": {
                if (splitArgs.length < 3) {
                    ChatRoomSendLocal("For teleports type, provide source X and Y coordinates");
                    return;
                }
                const X = parseInt(splitArgs[1], 10);
                const Y = parseInt(splitArgs[2], 10);
                let Teleports = ChatRoomData?.Custom?.WormholeList?.Teleports;
                if (!Teleports) {
                    ChatRoomSendLocal("No teleport wormholes found");
                    return;
                }
                // Validate all entries first
                for (let W in Teleports) {
                    if (!isValidTeleport(Teleports[W])) {
                        delete Teleports[W];
                        window.fixedCustomSettings = true;
                    }
                }
                const index = Teleports.findIndex(e => e.X === X && e.Y === Y);
                if (index === -1) {
                    ChatRoomSendLocal(`No teleport found at source coordinates (${X},${Y})`);
                    return;
                }
                Teleports.splice(index, 1);
                break;
            }
            case "chat": {
                const triggerWord = splitArgs.slice(1).join(" ");
                let ChatTriggers = ChatRoomData?.Custom?.WormholeList?.ChatTriggers;
                if (!ChatTriggers) {
                    ChatRoomSendLocal("No chat triggers found");
                    return;
                }
                // Validate all entries first
                for (let W in ChatTriggers) {
                    if (!isValidChatTrigger(ChatTriggers[W])) {
                        delete ChatTriggers[W];
                        window.fixedCustomSettings = true;
                    }
                }
                const index = ChatTriggers.findIndex(e => e.TriggerWord === triggerWord);
                if (index === -1) {
                    ChatRoomSendLocal(`No chat trigger found for "${triggerWord}"`);
                    return;
                }
                ChatTriggers.splice(index, 1);
                break;
            }
        }

        // Update room data after removal and cleanup
        const UpdatedRoom = ChatRoomGetSettings(ChatRoomData);
        UpdatedRoom.Custom = ChatRoomData.Custom;
        ServerSend("ChatRoomAdmin", { MemberNumber: Player.ID, Room: UpdatedRoom, Action: "Update" });
        if (window.fixedCustomSettings) {
            ChatRoomSendLocal("Invalid entries were removed during cleanup");
        }
        ChatRoomSendLocal("Wormhole removed successfully");
    }
}]);
//command for listing all or specific wormholes
CommandCombine([{
    Tag: 'wormholes',
    Description: "[type]: Lists wormholes. Optional type: coords, teleports, chat",
    Action: args => {
        args = args.toLowerCase().trim();
        if (args && !["coords", "teleports", "chat"].includes(args)) {
            ChatRoomSendLocal("Invalid wormhole type. Use: coords, teleports, or chat", 6600);
            return;
        }
        let output = "";
        // Handle Coordinate Wormholes
        if (!args || args === "coords") {
            if (ChatRoomData?.Custom?.WormholeList?.Coords) {
                initializeWormholeType("Coords");
                let Coords = ChatRoomData.Custom.WormholeList.Coords;
                if (Coords.length > 0) {
                    output += "Coordinate Wormholes:\n";
                    for (let W in Coords) {
                        if (isValidCoord(Coords[W])) {
                            output += `(X: ${Coords[W].X},Y: ${Coords[W].Y}) -> ${Coords[W].RoomName}\n`;
                        }
                    }
                }
            }
        }
        // Handle Teleports
        if (!args || args === "teleports") {
            if (ChatRoomData?.Custom?.WormholeList?.Teleports) {
                initializeWormholeType("Teleports");
                let Teleports = ChatRoomData.Custom.WormholeList.Teleports;
                if (Teleports.length > 0) {
                    if (output) output += "\n";
                    output += "Teleport Wormholes: (Two-way means, that it works backwards too.)\n";
                    for (let W in Teleports) {
                        if (isValidTeleport(Teleports[W])) {
                            output += `(X: ${Teleports[W].X},Y: ${Teleports[W].Y}) -> (X: ${Teleports[W].TargetX},Y: ${Teleports[W].TargetY})${Teleports[W].backWards ? " (Two-way)" : ""}\n`;
                        }
                    }
                }
            }
        }
        // Handle Chat Triggers
        if (!args || args === "chat") {
            if (ChatRoomData?.Custom?.WormholeList?.ChatTriggers) {
                initializeWormholeType("ChatTriggers");
                let ChatTriggers = ChatRoomData.Custom.WormholeList.ChatTriggers;
                if (ChatTriggers.length > 0) {
                    if (output) output += "\n";
                    output += "Chat Triggers:\n";
                    for (let W in ChatTriggers) {
                        if (isValidChatTrigger(ChatTriggers[W])) {
                            output += `"Trigger phrase: ${ChatTriggers[W].TriggerWord}" -> ${ChatTriggers[W].RoomName}\n`;
                        }
                    }
                }
            }
        }
        if (output !== "") {
            //need to remove the last "\n" from the end
            output = output.slice(0, -1);
            ChatRoomSendLocal(output);
        } else {
            ChatRoomSendLocal("No wormholes found" + (args ? ` of type: ${args}` : ""));
        }
    }
}]);
//help command
CommandCombine([{
    Tag: 'whhelp',
    Description: "[command]: Shows help for wormhole commands. Optionally specify a command for detailed help",
    Action: args => {
        
        WORMHOLE.whhelp(args);
    }
}]);
}
