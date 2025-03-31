import WHBase from '../base'
export default class Wormhole extends WHBase {

    //safety initializations
    private initializeWormholeType(type): void {
        if (!ChatRoomData || !ChatRoomData?.Admin?.includes(Player.MemberNumber)) return;
        window.changeDone = false;
        if (!ChatRoomData.Custom) {
            ChatRoomData.Custom = {};
            ChatRoomData.Custom.WormholeList = {};
            ChatRoomData.Custom.WormholeList[type] = [];
            window.changeDone = true;
        }
        if (!ChatRoomData.Custom.WormholeList) {
            ChatRoomData.Custom.WormholeList = {};
            ChatRoomData.Custom.WormholeList[type] = [];
            window.changeDone = true;
        }
        if (!ChatRoomData.Custom.WormholeList[type]) {
            ChatRoomData.Custom.WormholeList[type] = [];
            window.changeDone = true;
        }

        if (window.changeDone) {
            const UpdatedRoom = ChatRoomGetSettings(ChatRoomData);
            UpdatedRoom.Custom = ChatRoomData.Custom;
            ServerSend("ChatRoomAdmin", { MemberNumber: Player.ID, Room: UpdatedRoom, Action: "Update" });
            ChatRoomSendLocal(`${type} initialized.`, 6600);
        }
    }

    //register coordinate wormhole
    private registerCoordWormhole(
        X: number, 
        Y: number, 
        RoomName:string
    ): void {
        if (!ChatRoomData?.Admin?.includes(Player.MemberNumber) || ChatRoomData.name == RoomName) {
            if (!ChatRoomData?.Admin?.includes(Player.MemberNumber)) {
                ChatRoomSendLocal("You need to be an admin to register a wormhole.", 6600)
            } else {
                ChatRoomSendLocal("You can't register a wormhole with this room as the target.", 6600)
            }
            return;
        }
        // Validate inputs first
        if (!CommonIsInteger(X, 0, 39) ||
            !CommonIsInteger(Y, 0, 39) ||
            typeof RoomName !== "string" ||
            RoomName.length > 20) {
            ChatRoomSendLocal("Invalid wormhole coordinates or room name.\nMake sure X and Y are between 0-39 and room name is under 20 characters.", 6600);
            return;
        }
        if (ChatRoomData.Custom == null || !ChatRoomData?.Custom?.WormholeList || !ChatRoomData?.Custom.WormholeList?.Coords) {
            this.initializeWormholeType("Coords");
            this.WHdebugLog("WormholeList.Coords initialized.")
        }
        if (ChatRoomData.Custom.WormholeList.Coords.find(e => e.X === X && e.Y === Y && e.RoomName === RoomName)) {
            ChatRoomSendLocal("Wormhole already exists.", 6600)
            return;
        }
        const existingCoordIndex = ChatRoomData.Custom.WormholeList.Coords.findIndex(e => e.X === X && e.Y === Y);
        if (existingCoordIndex !== -1) {
            if (ChatRoomData.Custom.WormholeList.Coords[existingCoordIndex].RoomName !== RoomName) {
                // Edit wormhole with matching coordinates
                ChatRoomData.Custom.WormholeList.Coords[existingCoordIndex].RoomName = RoomName;
                //server room update
                const UpdatedRoom = ChatRoomGetSettings(ChatRoomData);
                UpdatedRoom.Custom = ChatRoomData.Custom;
                ServerSend("ChatRoomAdmin", { MemberNumber: Player.ID, Room: UpdatedRoom, Action: "Update" });
                ChatRoomSendLocal("Wormhole edited successfully.", 6600)
                return;
            }
        }
        //register in the new wormhole
        ChatRoomData.Custom.WormholeList.Coords.push({ X: X, Y: Y, RoomName: RoomName });
        const UpdatedRoom = ChatRoomGetSettings(ChatRoomData);
        UpdatedRoom.Custom = ChatRoomData.Custom;
        ServerSend("ChatRoomAdmin", { MemberNumber: Player.ID, Room: UpdatedRoom, Action: "Update" });
        ChatRoomSendLocal("Wormhole registered successfully.", 6600)
    }



    //register chat trigger wormhole
    private registerChatTriggerWormhole(
        TriggerWord: string, 
        RoomName: string
    ): void {
        if (!ChatRoomData?.Admin?.includes(Player.MemberNumber) || ChatRoomData.name == RoomName) {
            if (!ChatRoomData?.Admin?.includes(Player.MemberNumber)) {
                ChatRoomSendLocal("You need to be an admin to register a wormhole.", 6600)
            } else {
                ChatRoomSendLocal("You can't register a wormhole with this room as the target.", 6600)
            }
            return;
        }
        // Validate inputs first
        if (typeof TriggerWord !== "string" ||
            typeof RoomName !== "string" ||
            RoomName.length > 20) {
            ChatRoomSendLocal("Invalid wormhole room name.", 6600);
            return;
        }
        if (ChatRoomData.Custom == null || !ChatRoomData?.Custom?.WormholeList || !ChatRoomData?.Custom.WormholeList?.ChatTriggers) {
            this.initializeWormholeType("ChatTriggers");
            ChatRoomSendLocal("WormholeList.ChatTriggers initialized.", 6600)
        }
        const existingSourceIndex = ChatRoomData.Custom.WormholeList.ChatTriggers.findIndex(e => e.TriggerWord === TriggerWord);
        if (existingSourceIndex !== -1 && ChatRoomData.Custom.WormholeList.ChatTriggers[existingSourceIndex].RoomName !== RoomName) {
            // If trigger word exists, update its target room
            ChatRoomData.Custom.WormholeList.ChatTriggers[existingSourceIndex].RoomName = RoomName;
            const UpdatedRoom = ChatRoomGetSettings(ChatRoomData);
            UpdatedRoom.Custom = ChatRoomData.Custom;
            ServerSend("ChatRoomAdmin", { MemberNumber: Player.ID, Room: UpdatedRoom, Action: "Update" });
            ChatRoomSendLocal("Wormhole edited successfully.", 6600)
            return;
        }
        //register in the new wormhole
        ChatRoomData.Custom.WormholeList.ChatTriggers.push({ TriggerWord: TriggerWord, RoomName: RoomName });
        const UpdatedRoom = ChatRoomGetSettings(ChatRoomData);
        UpdatedRoom.Custom = ChatRoomData.Custom;
        ServerSend("ChatRoomAdmin", { MemberNumber: Player.ID, Room: UpdatedRoom, Action: "Update" });
        ChatRoomSendLocal("Wormhole registered.", 6600)
    }


    //register teleport wormhole
    private registerTeleportWormhole(
        X: number, 
        Y: number, 
        TargetX: number, 
        TargetY: number, 
        backWards: boolean = false
    ): void {
        if (!ChatRoomData?.Admin?.includes(Player.MemberNumber)) {
            ChatRoomSendLocal("You need to be an admin to register a wormhole.", 6600)
            return;
        }
        // Validate inputs first
        if (!CommonIsInteger(X, 0, 39) ||
            !CommonIsInteger(Y, 0, 39) ||
            !CommonIsInteger(TargetX, 0, 39) ||
            !CommonIsInteger(TargetY, 0, 39) ||
            typeof backWards !== "boolean") {
            ChatRoomSendLocal("Invalid wormhole coordinates.\nMake sure X, Y, TargetX, TargetY are between 0-39 and backWards is a boolean.", 6600);
            return;
        }
        // Check if source equals target
        if (X === TargetX && Y === TargetY) {
            ChatRoomSendLocal("Source and target coordinates cannot be the same.", 6600);
            return;
        }
        if (!ChatRoomData.Custom?.WormholeList?.Teleports) {
            this.initializeWormholeType("Teleports");
            this.WHdebugLog("WormholeList.Teleports initialized.")
        }
        const Teleports = ChatRoomData.Custom.WormholeList.Teleports;
        // Check if exact teleport already exists
        if (Teleports.find(e => e.X === X && e.Y === Y && e.TargetX === TargetX && e.TargetY === TargetY && e.backWards === backWards)) {
            ChatRoomSendLocal("This exact wormhole already exists.", 6600)
            return;
        }
        // Check for target sharing rules when trying to enable backwards compatibility
        const TeleportsMinusOriginal = Teleports.filter(e => e.X !== X || e.Y !== Y);
        if (backWards && TeleportsMinusOriginal.find(e => e.TargetX === TargetX && e.TargetY === TargetY)) {
            ChatRoomSendLocal("Cannot make teleport backwards compatible when target is shared by multiple teleports.", 6600);
            return;
        }
        // Find existing teleport with same source coordinates for editing
        const existingSourceIndex = Teleports.findIndex(e => e.X === X && e.Y === Y);
        if (existingSourceIndex !== -1) {
            let existingSourceEdited = false;
            if (Teleports[existingSourceIndex].TargetX !== TargetX || Teleports[existingSourceIndex].TargetY === TargetY) {
                // If target coordinates are different, edit existing source teleport
                Teleports[existingSourceIndex].TargetX = TargetX;
                Teleports[existingSourceIndex].TargetY = TargetY;
                existingSourceEdited = true;
            }
            if (Teleports[existingSourceIndex].backWards !== backWards) {
                // If backwards compatibility is different, edit existing source teleport
                Teleports[existingSourceIndex].backWards = backWards;
                existingSourceEdited = true;
            }
            // Allow editing target or backwards compatibility
            if (existingSourceEdited) {
                const UpdatedRoom = ChatRoomGetSettings(ChatRoomData);
                UpdatedRoom.Custom = ChatRoomData.Custom;
                ServerSend("ChatRoomAdmin", { MemberNumber: Player.ID, Room: UpdatedRoom, Action: "Update" });
                ChatRoomSendLocal("Wormhole edited successfully.", 6600)
                return;
            }
        }
        // Add new teleport
        Teleports.push({ X: X, Y: Y, TargetX: TargetX, TargetY: TargetY, backWards: backWards });
        const UpdatedRoom = ChatRoomGetSettings(ChatRoomData);
        UpdatedRoom.Custom = ChatRoomData.Custom;
        ServerSend("ChatRoomAdmin", { MemberNumber: Player.ID, Room: UpdatedRoom, Action: "Update" });
        ChatRoomSendLocal("Wormhole registered successfully.", 6600)
    }

    //function for bools validation/registration
    private validateWormholeTriggers(): void {
        //initialize wormhole settings at first run as true
        if (!Player.OnlineSharedSettings.WormholeTriggers) {
            Player.OnlineSharedSettings.WormholeTriggers = {
                TeleportsTrigger: true,
                ChatTriggersTrigger: true,
                CoordsTrigger: true
            };
            ServerAccountUpdate.QueueData({ OnlineSharedSettings: Player.OnlineSharedSettings }, true);
            return;
        }
        // Check and fix boolean values
        let needsUpdate = false;
        const wormHoleSettings = (Player.OnlineSharedSettings.WormholeTriggers ??= {});
        if (typeof wormHoleSettings.TeleportsTrigger !== 'boolean') {
            wormHoleSettings.TeleportsTrigger = false;
            needsUpdate = true;
        }
        if (typeof wormHoleSettings.ChatTriggersTrigger !== 'boolean') {
            wormHoleSettings.ChatTriggersTrigger = false;
            needsUpdate = true;
        }
        if (typeof wormHoleSettings.CoordsTrigger !== 'boolean') {
            wormHoleSettings.CoordsTrigger = false;
            needsUpdate = true;
        }
        if (needsUpdate) {
            Player.OnlineSharedSettings.WormholeTriggers = wormHoleSettings;
            ServerAccountUpdate.QueueData({ OnlineSharedSettings: Player.OnlineSharedSettings }, true);
        }
    }


    //--------------------------------------




    public whcoord(args: any): void {
        const splitArgs = args.split(" ");
        const roomName = splitArgs.slice(2).join(" "); // Handle room names with spaces

        if (splitArgs.length < 3) {
            ChatRoomSendLocal("Usage: /whcoord [X] [Y] [RoomName]");
            return;
        }

        const X = parseInt(splitArgs[0], 10);
        const Y = parseInt(splitArgs[1], 10);

        this.registerCoordWormhole(X, Y, roomName);
    }


    public whchat(args: any): void {
        const splitPoint = args.indexOf(" ");
        if (splitPoint === -1) {
            ChatRoomSendLocal("Usage: /whchat [TriggerWord] [RoomName]");
            return;
        }

        const triggerWord = args.substring(0, splitPoint);
        const roomName = args.substring(splitPoint + 1);

        this.registerChatTriggerWormhole(triggerWord, roomName);
    }


    public whteleport (args: any): void {

        const splitArgs = args.split(" ");
        if (splitArgs.length < 4) {
            ChatRoomSendLocal("Usage: /whteleport [X] [Y] [TargetX] [TargetY] [backwards?]");
            return;
        }
        const X = parseInt(splitArgs[0], 10);
        const Y = parseInt(splitArgs[1], 10);
        const TargetX = parseInt(splitArgs[2], 10);
        const TargetY = parseInt(splitArgs[3], 10);
        const backWards = splitArgs[4] ? splitArgs[4].toLowerCase() === 'true' : false;
        this.registerTeleportWormhole(X, Y, TargetX, TargetY, backWards);

    }

    public whtrigger (args: any): void {
        const splitArgs = args.toLowerCase().split(" ");
        if (splitArgs.length !== 2) {
            ChatRoomSendLocal("Usage: /whtrigger [type] [true/false]\nTypes: coords, teleports, chat");
            return;
        }

        const type = splitArgs[0];
        const state = splitArgs[1] === 'true';

        if (!["coords", "teleports", "chat"].includes(type)) {
            ChatRoomSendLocal("Invalid type. Use: coords, teleports, or chat");
            return;
        }
        // Map command input to settings name
        const triggerMap = {
            "coords": "CoordsTrigger",
            "teleports": "TeleportsTrigger",
            "chat": "ChatTriggersTrigger"
        };

        if (Player.OnlineSharedSettings.WormholeTriggers[triggerMap[type]] === state) {
            ChatRoomSendLocal(`Wormholes for ${type} are already ${state ? "enabled" : "disabled"}.`);
            return;
        }
        Player.OnlineSharedSettings.WormholeTriggers[triggerMap[type]] = state;
        ServerAccountUpdate.QueueData({ OnlineSharedSettings: Player.OnlineSharedSettings }, true);
        ChatRoomSendLocal(`Wormholes for ${type} ${state ? "enabled" : "disabled"}.`);
    }

    public whremove(args: any): void {

    }

    public wormholes(args: any): void {

    }

    public whhelp(args: any): void {
        // Check and fix boolean values
        this.validateWormholeTriggers();
        // Show current trigger states
        let triggerStatus = "Current Trigger States:\n";
        triggerStatus += `Coordinate Wormholes: ${Player.OnlineSharedSettings.WormholeTriggers.CoordsTrigger ? "Enabled" : "Disabled"}\n`;
        triggerStatus += `Teleport Wormholes: ${Player.OnlineSharedSettings.WormholeTriggers.TeleportsTrigger ? "Enabled" : "Disabled"}\n`;
        triggerStatus += `Chat Triggers: ${Player.OnlineSharedSettings.WormholeTriggers.ChatTriggersTrigger ? "Enabled" : "Disabled"}\n`;

        const commands = {
            "whcoord": "Usage: /whcoord [X] [Y] [RoomName]\nRegisters a coordinate wormhole at X,Y that leads to RoomName",
            "whchat": "Usage: /whchat [TriggerWord] [RoomName]\nRegisters a chat trigger that sends to RoomName when TriggerWord is said",
            "whteleport": "Usage: /whteleport [X] [Y] [TargetX] [TargetY] [backwards?]\nRegisters a teleport from X,Y to TargetX,TargetY. Optional 'true' for two-way",
            "whtrigger": "Usage: /whtrigger [type] [true/false]\nToggles specific wormhole type. Types: coords, teleports, chat",
            "whremove": "Usage: /whremove [type] [identifier]\nRemoves a wormhole. Types: coords, teleports, chat\nIdentifier format depends on type:\n- coords: X Y\n- teleports: X Y\n- chat: triggerword",
            "wormholes": "Usage: /wormholes [type]\nLists all or specific type of wormholes. Optional type: coords, teleports, chat",
            "whhelp": "Usage: /whhelp [command]\nShows this help menu or detailed help for a specific command"
        };

        args = args.toLowerCase().trim();

        if (args && commands[args]) {
            // Show detailed help for specific command
            ChatRoomSendLocal(commands[args]);
        } else if (args) {
            ChatRoomSendLocal("Unknown command. Available commands: " + Object.keys(commands).join(", "));
        } else {
            // Show general help
            let output = "Wormhole Commands:\n";
            Object.entries(commands).forEach(([cmd, desc]) => {
                output += `/${cmd}: ${desc.split('\n')[0].replace('Usage: /', '')}\n`;
            });
            output += "\nFor detailed help on any command, use: /whhelp [command]\n";
            output += "\n" + triggerStatus;

            // Remove final newline
            output = output.slice(0, -1);
            ChatRoomSendLocal(output);
        }
    }








}