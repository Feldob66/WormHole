// Wormhole 0.0.8
/** @type {BCModSDKGlobalAPI} */
var bcModSDK = function () { "use strict"; const o = "1.2.0"; function e(o) { alert("Mod ERROR:\n" + o); const e = new Error(o); throw console.error(e), e } const t = new TextEncoder; function n(o) { return !!o && "object" == typeof o && !Array.isArray(o) } function r(o) { const e = new Set; return o.filter((o => !e.has(o) && e.add(o))) } const i = new Map, a = new Set; function c(o) { a.has(o) || (a.add(o), console.warn(o)) } function s(o) { const e = [], t = new Map, n = new Set; for (const r of f.values()) { const i = r.patching.get(o.name); if (i) { e.push(...i.hooks); for (const [e, a] of i.patches.entries()) t.has(e) && t.get(e) !== a && c(`ModSDK: Mod '${r.name}' is patching function ${o.name} with same pattern that is already applied by different mod, but with different pattern:\nPattern:\n${e}\nPatch1:\n${t.get(e) || ""}\nPatch2:\n${a}`), t.set(e, a), n.add(r.name) } } e.sort(((o, e) => e.priority - o.priority)); const r = function (o, e) { if (0 === e.size) return o; let t = o.toString().replaceAll("\r\n", "\n"); for (const [n, r] of e.entries()) t.includes(n) || c(`ModSDK: Patching ${o.name}: Patch ${n} not applied`), t = t.replaceAll(n, r); return (0, eval)(`(${t})`) }(o.original, t); let i = function (e) { var t, i; const a = null === (i = (t = m.errorReporterHooks).hookChainExit) || void 0 === i ? void 0 : i.call(t, o.name, n), c = r.apply(this, e); return null == a || a(), c }; for (let t = e.length - 1; t >= 0; t--) { const n = e[t], r = i; i = function (e) { var t, i; const a = null === (i = (t = m.errorReporterHooks).hookEnter) || void 0 === i ? void 0 : i.call(t, o.name, n.mod), c = n.hook.apply(this, [e, o => { if (1 !== arguments.length || !Array.isArray(e)) throw new Error(`Mod ${n.mod} failed to call next hook: Expected args to be array, got ${typeof o}`); return r.call(this, o) }]); return null == a || a(), c } } return { hooks: e, patches: t, patchesSources: n, enter: i, final: r } } function l(o, e = !1) { let r = i.get(o); if (r) e && (r.precomputed = s(r)); else { let e = window; const a = o.split("."); for (let t = 0; t < a.length - 1; t++)if (e = e[a[t]], !n(e)) throw new Error(`ModSDK: Function ${o} to be patched not found; ${a.slice(0, t + 1).join(".")} is not object`); const c = e[a[a.length - 1]]; if ("function" != typeof c) throw new Error(`ModSDK: Function ${o} to be patched not found`); const l = function (o) { let e = -1; for (const n of t.encode(o)) { let o = 255 & (e ^ n); for (let e = 0; e < 8; e++)o = 1 & o ? -306674912 ^ o >>> 1 : o >>> 1; e = e >>> 8 ^ o } return ((-1 ^ e) >>> 0).toString(16).padStart(8, "0").toUpperCase() }(c.toString().replaceAll("\r\n", "\n")), d = { name: o, original: c, originalHash: l }; r = Object.assign(Object.assign({}, d), { precomputed: s(d), router: () => { }, context: e, contextProperty: a[a.length - 1] }), r.router = function (o) { return function (...e) { return o.precomputed.enter.apply(this, [e]) } }(r), i.set(o, r), e[r.contextProperty] = r.router } return r } function d() { for (const o of i.values()) o.precomputed = s(o) } function p() { const o = new Map; for (const [e, t] of i) o.set(e, { name: e, original: t.original, originalHash: t.originalHash, sdkEntrypoint: t.router, currentEntrypoint: t.context[t.contextProperty], hookedByMods: r(t.precomputed.hooks.map((o => o.mod))), patchedByMods: Array.from(t.precomputed.patchesSources) }); return o } const f = new Map; function u(o) { f.get(o.name) !== o && e(`Failed to unload mod '${o.name}': Not registered`), f.delete(o.name), o.loaded = !1, d() } function g(o, t) { o && "object" == typeof o || e("Failed to register mod: Expected info object, got " + typeof o), "string" == typeof o.name && o.name || e("Failed to register mod: Expected name to be non-empty string, got " + typeof o.name); let r = `'${o.name}'`; "string" == typeof o.fullName && o.fullName || e(`Failed to register mod ${r}: Expected fullName to be non-empty string, got ${typeof o.fullName}`), r = `'${o.fullName} (${o.name})'`, "string" != typeof o.version && e(`Failed to register mod ${r}: Expected version to be string, got ${typeof o.version}`), o.repository || (o.repository = void 0), void 0 !== o.repository && "string" != typeof o.repository && e(`Failed to register mod ${r}: Expected repository to be undefined or string, got ${typeof o.version}`), null == t && (t = {}), t && "object" == typeof t || e(`Failed to register mod ${r}: Expected options to be undefined or object, got ${typeof t}`); const i = !0 === t.allowReplace, a = f.get(o.name); a && (a.allowReplace && i || e(`Refusing to load mod ${r}: it is already loaded and doesn't allow being replaced.\nWas the mod loaded multiple times?`), u(a)); const c = o => { let e = g.patching.get(o.name); return e || (e = { hooks: [], patches: new Map }, g.patching.set(o.name, e)), e }, s = (o, t) => (...n) => { var i, a; const c = null === (a = (i = m.errorReporterHooks).apiEndpointEnter) || void 0 === a ? void 0 : a.call(i, o, g.name); g.loaded || e(`Mod ${r} attempted to call SDK function after being unloaded`); const s = t(...n); return null == c || c(), s }, p = { unload: s("unload", (() => u(g))), hookFunction: s("hookFunction", ((o, t, n) => { "string" == typeof o && o || e(`Mod ${r} failed to patch a function: Expected function name string, got ${typeof o}`); const i = l(o), a = c(i); "number" != typeof t && e(`Mod ${r} failed to hook function '${o}': Expected priority number, got ${typeof t}`), "function" != typeof n && e(`Mod ${r} failed to hook function '${o}': Expected hook function, got ${typeof n}`); const s = { mod: g.name, priority: t, hook: n }; return a.hooks.push(s), d(), () => { const o = a.hooks.indexOf(s); o >= 0 && (a.hooks.splice(o, 1), d()) } })), patchFunction: s("patchFunction", ((o, t) => { "string" == typeof o && o || e(`Mod ${r} failed to patch a function: Expected function name string, got ${typeof o}`); const i = l(o), a = c(i); n(t) || e(`Mod ${r} failed to patch function '${o}': Expected patches object, got ${typeof t}`); for (const [n, i] of Object.entries(t)) "string" == typeof i ? a.patches.set(n, i) : null === i ? a.patches.delete(n) : e(`Mod ${r} failed to patch function '${o}': Invalid format of patch '${n}'`); d() })), removePatches: s("removePatches", (o => { "string" == typeof o && o || e(`Mod ${r} failed to patch a function: Expected function name string, got ${typeof o}`); const t = l(o); c(t).patches.clear(), d() })), callOriginal: s("callOriginal", ((o, t, n) => { "string" == typeof o && o || e(`Mod ${r} failed to call a function: Expected function name string, got ${typeof o}`); const i = l(o); return Array.isArray(t) || e(`Mod ${r} failed to call a function: Expected args array, got ${typeof t}`), i.original.apply(null != n ? n : globalThis, t) })), getOriginalHash: s("getOriginalHash", (o => { "string" == typeof o && o || e(`Mod ${r} failed to get hash: Expected function name string, got ${typeof o}`); return l(o).originalHash })) }, g = { name: o.name, fullName: o.fullName, version: o.version, repository: o.repository, allowReplace: i, api: p, loaded: !0, patching: new Map }; return f.set(o.name, g), Object.freeze(p) } function h() { const o = []; for (const e of f.values()) o.push({ name: e.name, fullName: e.fullName, version: e.version, repository: e.repository }); return o } let m; const y = void 0 === window.bcModSdk ? window.bcModSdk = function () { const e = { version: o, apiVersion: 1, registerMod: g, getModsInfo: h, getPatchingInfo: p, errorReporterHooks: Object.seal({ apiEndpointEnter: null, hookEnter: null, hookChainExit: null }) }; return m = e, Object.freeze(e) }() : (n(window.bcModSdk) || e("Failed to init Mod SDK: Name already in use"), 1 !== window.bcModSdk.apiVersion && e(`Failed to init Mod SDK: Different version already loaded ('1.2.0' vs '${window.bcModSdk.version}')`), window.bcModSdk.version !== o && alert(`Mod SDK warning: Loading different but compatible versions ('1.2.0' vs '${window.bcModSdk.version}')\nOne of mods you are using is using an old version of SDK. It will work for now but please inform author to update`), window.bcModSdk); return "undefined" != typeof exports && (Object.defineProperty(exports, "__esModule", { value: !0 }), exports.default = y), y }();
//Bondage Club Mod Script Development Kit (1.2.0) for more info see: https://github.com/Jomshir98/bondage-club-mod-sdk
const WHver = "0.0.8";
const WH_API = bcModSDK.registerMod({
    name: 'WH',
    fullName: 'WormHole',
    version: WHver,
    repository: 'https://example.com/'
});

//Global variables initialization
function initGlobalVars() {
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
initGlobalVars();

// Preload Backwards Portal Image
const backwardsPortalImage = new Image();
backwardsPortalImage.src = "https://raw.githubusercontent.com/Feldob66/WormHole/refs/heads/main/Wormholes.png";
window.backwardsPortalImage = backwardsPortalImage;
window.backwardsPortalImageReady = false;
backwardsPortalImage.onload = () => window.backwardsPortalImageReady = true;

// Preload Starting Portal Image
const startingPortalImage = new Image();
startingPortalImage.src = "https://raw.githubusercontent.com/Feldob66/WormHole/refs/heads/main/Wormholes.png";
window.startingPortalImage = startingPortalImage;
window.startingPortalImageReady = false;
startingPortalImage.onload = () => window.startingPortalImageReady = true;

// Preload Target Portal Image
const targetPortalImage = new Image();
targetPortalImage.src = "https://raw.githubusercontent.com/Feldob66/WormHole/refs/heads/main/Wormholes.png";
window.targetPortalImage = targetPortalImage;
window.targetPortalImageReady = false;
targetPortalImage.onload = () => window.targetPortalImageReady = true;

// Preload Room Wormhole Image
const roomWormholeImage = new Image();
roomWormholeImage.src = "https://raw.githubusercontent.com/Feldob66/WormHole/refs/heads/main/Wormholes.png";
window.roomWormholeImage = roomWormholeImage;
window.roomWormholeImageReady = false;
roomWormholeImage.onload = () => window.roomWormholeImageReady = true;

function WHdebugLog(message) {
    if (window.WHdebugMode) {
        console.log(message);
    }
}

//Custom addon function #1
function joinWormhole(roomName) {
    if ("" == roomName || !roomName) { return; }
    if (ChatRoomData?.Name) {
        ChatRoomSendLocal("Sending search request for room: " + roomName, 6600);
        window.targetedRoom = roomName;
        window.oldRoomName = ChatRoomData.Name;
        window.oldRoomSpace = ChatRoomData.Space;
        window.serverAnswered = false;
        window.wormHoleSearch = true;
        ServerSend("ChatRoomSearch", { Query: roomName.toUpperCase(), Language: "", Space: ChatRoomData.Space, Game: "", FullRooms: true, ShowLocked: true });
    } else if (window.oldRoomName != "" && ["", "X", "M"].includes(window.oldRoomSpace)) {
        ChatRoomSendLocal("Sending search request for room: " + roomName, 6600); //we need to get to at least here...
        window.targetedRoom = roomName;
        window.serverAnswered = false;
        window.wormHoleSearch = true;
        ServerSend("ChatRoomSearch", { Query: roomName.toUpperCase(), Language: "", Space: window.oldRoomSpace, Game: "", FullRooms: true, ShowLocked: true });
        window.oldRoomName = "";
        window.oldRoomSpace = undefined;
    }
}
//register coordinate wormhole
function registerCoordWormhole(X, Y, RoomName) {
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
        initializeWormholeType("Coords");
        WHdebugLog("WormholeList.Coords initialized.")
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
function registerChatTriggerWormhole(TriggerWord, RoomName) {
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
        initializeWormholeType("ChatTriggers");
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
function registerTeleportWormhole(X, Y, TargetX, TargetY, backWards = false) {
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
        initializeWormholeType("Teleports");
        WHdebugLog("WormholeList.Teleports initialized.")
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
//validation teleports
function isValidTeleport(teleport) {
    return CommonIsInteger(teleport.X, 0, 39) &&
        CommonIsInteger(teleport.Y, 0, 39) &&
        CommonIsInteger(teleport.TargetX, 0, 39) &&
        CommonIsInteger(teleport.TargetY, 0, 39) &&
        typeof teleport.backWards === "boolean";
}
//validation coords
function isValidCoord(coord) {
    return CommonIsInteger(coord.X, 0, 39) &&
        CommonIsInteger(coord.Y, 0, 39) &&
        typeof coord.RoomName === "string" &&
        coord.RoomName.length <= 20;
}
//validation chat triggers
function isValidChatTrigger(trigger) {
    return typeof trigger.TriggerWord === "string" &&
        typeof trigger.RoomName === "string" &&
        trigger.RoomName.length <= 20;
}
//safety initializations
function initializeWormholeType(type) {
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
        /*Remove double updates to the chatroom when registering the very first wormhole of each type
        ServerSend("ChatRoomAdmin", { MemberNumber: Player.ID, Room: UpdatedRoom, Action: "Update" });*/
        ChatRoomSendLocal(`${type} initialized.`, 6600);
    }
}
//function for bools validation/registration
function validateWormholeTriggers() {
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
//init for safe addon loading
function initWait() {
    if (CurrentScreen == null || CurrentScreen === "Login") {
        WH_API.hookFunction("LoginResponse", 0, (args, next) => {
            next(args);
            const response = args[0];
            if (response && typeof response.Name === "string" && typeof response.AccountName === "string") {
                init();
            }
        });
    } else {
        init();
    }
}

function init() {
    // Initialize our default settings if they don't exist
    validateWormholeTriggers();
    //#1 ChatSearchResponse listener | Safer handling
    WH_API.hookFunction('ChatSearchResponse', 4, (args, next) => {
        var data = args[0];
        if (typeof data !== "string") next(args);
        //custom code
        if (window.wormHoleSearch) {
            WHdebugLog(data)
            if (data == "RoomBanned") {
                joinWormhole(window.oldRoomName);
                setTimeout(() => {
                    window.oldRoomName = "";
                    ChatRoomSendLocal("You have been banned from the connected/linked room.", 6600)
                }, 6600);
                return;
            } else if (data == "RoomLocked") {
                WHdebugLog("Attempting to rejoin old room:", window.oldRoomName);
                joinWormhole(window.oldRoomName);
                setTimeout(() => {
                    window.oldRoomName = "";
                    ChatRoomSendLocal("The room you tried to join is locked and you don't meet the join requirements.")
                }, 6600);
                return; // Ensure we return here to prevent further execution
            } else if (data == "CannotFindRoom") {
                ChatRoomSendLocal("The room you are trying to join does not exist.", 6600)
            } else if (data == "JoinedRoom") {
                //ChatRoomSendLocal("You have joined the connected/linked room.", 6600)
                window.wormHoleSearch = false;
            } else if (data == "RoomKicked") {
                ChatRoomSendLocal("You have been kicked from the connected/linked room recently.", 6600)
            } else {
                WHdebugLog("Unhandled response for: (" + data + ")")
            }
            window.wormHoleSearch = false;
            return;
        } else {
            //custom code
            next(args);
        }
    });
    //#2 Arrow Movement Listener
    WH_API.hookFunction('ChatRoomMapViewMovementProcess', 4, (args, next) => {
        const { X: posX, Y: posY } = Player.MapData.Pos;
        const ret = next(args);
        if (posX !== Player.MapData.Pos.X || posY !== Player.MapData.Pos.Y) {
            //custom code
            const movedToX = Player.MapData.Pos.X;
            const movedToY = Player.MapData.Pos.Y;
            WHdebugLog("Teleported to: " + movedToX + "," + movedToY)

            let coordMatch = false;
            let teleportMatch = false;

            // Check coordinates wormholes
            if (ChatRoomData && ChatRoomData.Custom && ChatRoomData.Custom?.WormholeList &&
                ChatRoomData.Custom?.WormholeList?.Coords &&
                Player.OnlineSharedSettings.WormholeTriggers?.CoordsTrigger > 0 &&
                !window.teleportedByWormhole) {

                const CoordWormholes = ChatRoomData.Custom.WormholeList.Coords;
                if (CoordWormholes?.length >= 1) {
                    for (let W in CoordWormholes) {
                        if (movedToX == CoordWormholes[W].X && movedToY == CoordWormholes[W].Y) {
                            joinWormhole(CoordWormholes[W].RoomName);
                            coordMatch = true;
                            break;
                        }
                    }
                }
            }

            // Check teleport wormholes
            if (ChatRoomData && ChatRoomData.Custom && ChatRoomData.Custom?.WormholeList &&
                ChatRoomData.Custom?.WormholeList?.Teleports &&
                Player?.OnlineSharedSettings?.WormholeTriggers?.TeleportsTrigger &&
                !window.teleportedByWormhole) {

                const Teleports = ChatRoomData.Custom.WormholeList.Teleports;
                if (Teleports?.length >= 1) {
                    for (let W in Teleports) {
                        if (movedToX == Teleports[W].X && movedToY == Teleports[W].Y) {
                            // Teleport to target coordinates
                            window.teleportedByWormhole = true;
                            Player.MapData.Pos.X = Teleports[W].TargetX;
                            Player.MapData.Pos.Y = Teleports[W].TargetY;
                            ChatRoomMapViewUpdatePlayerFlag(-ChatRoomMapViewUpdatePlayerTime);
                            teleportMatch = true;
                            break;
                        } else if (Teleports[W].backWards && movedToX == Teleports[W].TargetX && movedToY == Teleports[W].TargetY) {
                            // If backwards compatible and on target coordinates, teleport back to source
                            window.teleportedByWormhole = true;
                            Player.MapData.Pos.X = Teleports[W].X;
                            Player.MapData.Pos.Y = Teleports[W].Y;
                            ChatRoomMapViewUpdatePlayerFlag(-ChatRoomMapViewUpdatePlayerTime);
                            teleportMatch = true;
                            break;
                        }
                    }
                }
            }

            // Reset teleport flag if no matches occurred
            if (!coordMatch && !teleportMatch && window.teleportedByWormhole) {
                window.teleportedByWormhole = false;
            }

            //custom code
        }
        return ret;
    });
    //#3 Chat Listener | Handle ChatTrigger teleports
    WH_API.hookFunction("ChatRoomMessage", 0, async (args, next) => {
        //custom code
        var data = args[0];
        let ignoredTypes = ["Hidden", "Status", "Action", "Activity", "LocalMessage"];
        if (data && data.Sender == Player.MemberNumber && !ignoredTypes.includes(data.Type)) {
            WHdebugLog(data)
            //check all the chat triggers
            if (ChatRoomData.Custom?.WormholeList?.ChatTriggers && Player?.OnlineSharedSettings?.WormholeTriggers?.ChatTriggersTrigger) {
                const ChatTriggers = ChatRoomData.Custom.WormholeList.ChatTriggers;
                if (ChatTriggers.length < 1) { return next(args); }
                for (let W in ChatTriggers) {
                    if (data.Content.includes(ChatTriggers[W].TriggerWord)) {
                        joinWormhole(ChatTriggers[W].RoomName);
                        break;
                    }
                }
            }
        }
        //custom code
        next(args);
    });
    //#4 ChatRoomSync Listener | Handle room entry
    WH_API.hookFunction('ChatRoomSync', 4, (args, next) => {
        const ret = next(args);
        //custom code
        if (!ChatRoomData) {
            // We had to leave the room for some reason
            return ret;
        }
        // Now you can check ChatRoomData
        if (ChatRoomData?.Custom?.WormholeList?.ChatTriggers && Player.OnlineSharedSettings.WormholeTriggers?.ChatTriggersTrigger) {
            //need to verify the chatroom's chat triggers, then fix and list them
            let ChatTriggers = ChatRoomData.Custom.WormholeList.ChatTriggers;
            if (ChatTriggers && ChatTriggers.length > 0) {
                let triggerList = "";
                for (let W in ChatTriggers) {
                    triggerList += ChatTriggers[W].TriggerWord + " -> " + ChatTriggers[W].RoomName + "\n";
                }
                //timeout of 360ms to only show it after the other stuff being added to chat by default
                setTimeout(() => {
                    ChatRoomSendLocal("Chat triggers:\n" + triggerList, 6600)
                }, 360);
            }
        }
        //custom code
        return ret;
    });
    //#5 ChatRoomList receiver | Handle room list | ChatSearchResultResponse
    WH_API.hookFunction('ChatSearchResultResponse', 4, (args, next) => {
        const data = args[0];
        if (!window.serverAnswered) {
            ChatSearchResult = data;
            window.serverAnswered = true;
            WHdebugLog(ChatSearchResult);
            let targetRoom = ChatSearchResult.find(room => room.Name.toUpperCase() == window.targetedRoom.toUpperCase());
            if (targetRoom) {
                WHdebugLog(targetRoom);
                if (targetRoom.MemberCount >= targetRoom.MemberLimit) {
                    ChatRoomSendLocal("Target room is Full.");
                    window.wormHoleSearch = false; // Reset flag
                } else {
                    ChatRoomSendLocal("Joining target room.");
                    window.wormHoleSearch = true;
                    ChatRoomLeave();
                    CommonSetScreen("Online", "ChatSearch");
                    ServerSend("ChatRoomJoin", { Name: targetRoom.Name });
                }
            } else {
                ChatRoomSendLocal("Target room ("+targetedRoom+") Not Found.");
                window.wormHoleSearch = false; // Reset flag
            }
        } else {
            return next(args);
        }
    });
    //#6 Handing Being pushed by a wall or a player | Quicker teleport ready-ness without getting stuck in a back and forth teleport loop.
    WH_API.hookFunction('ChatRoomMapViewUpdatePlayerFlag', 4, (args, next) => {
        const ret = next(args);
        if (window.teleportedByWormhole) {
            setTimeout(() => {
                window.teleportedByWormhole = false;
            }, 36);
        }
        return ret;
    });
    //#7 Handle translation search freaking out.
    //the function is: function CommonGet(Path, Callbacks, RetriesLeft)
    WH_API.hookFunction('CommonGet', 4, (args, next) => {
        let Path = args[0];
        WHdebugLog(Path);
        if (Path.includes("Wormholes")) {
            return;
        }
        return next(args);
    });
    //#7 Make sure, that /mapcopy also copies over the wormhole list
    WH_API.hookFunction('ChatRoomMapViewCopy', 4, (args, next) => {
        // Make sure there's a valid map to copy first
	    if ((ChatRoomData == null) || (ChatRoomData.MapData == null) || (ChatRoomData.MapData.Type == null) || (ChatRoomData.MapData.Type == "Never")) {
		    ChatRoomSendLocal(TextGet("MapCopyError"));
		    return;
	    }
        WHdebugLog(ChatRoomData.MapData)
        //create a new array for the expanded map data
        let expandedMapData = ChatRoomData.MapData;
        expandedMapData.WormholeList = ChatRoomData.Custom?.WormholeList ?? { Coords: [], Teleports: [], ChatTriggers: [] };
        WHdebugLog(expandedMapData.WormholeList)
	    // Stringify and compress the map in a string
	    let S = JSON.stringify(expandedMapData);
        WHdebugLog(S)
	    S = LZString.compressToBase64(S);
	    navigator.clipboard.writeText(S);
	    ChatRoomSendLocal(TextGet("MapCopyDone"));
    });
    //#8 Make sure to, if there is wormhole data, to copy it over to the new map
    WH_API.hookFunction('ChatRoomMapViewPaste', 4, (args, next) => {
        //define the Param variable
        let Param = args[0];
        // Validates the data first
	    if (typeof Param !== "string" || Param.length === 0) {
		    ChatRoomSendLocal(TextGet("MapPasteError"));
		    return;
	    }

	    // Only admins can paste/edit the map
	    if (!ChatRoomPlayerIsAdmin()) {
		    ChatRoomSendLocal(TextGet("MapPasteAdmin"));
		    return;
	    }

	    // Try to decompress the data
	    let DecompressedData = null;
	    try {
		    DecompressedData = LZString.decompressFromBase64(Param);
	    } catch(err) {
		    DecompressedData = null;
	    }

	    // If we failed to decompress
	    if (DecompressedData == null) {
		    ChatRoomSendLocal(TextGet("MapPasteError"));
		    return;
	    }

	    // Tries to get the map data object
	    let MapData = null;
	    try {
		    MapData = JSON.parse(DecompressedData);
	    } catch(err) {
		    MapData = null;
	    }

	    // If the map data is invalid
	    if ((MapData == null) || (MapData.Tiles == null)) {
		    ChatRoomSendLocal(TextGet("MapPasteError"));
		    return;
	    }
        let WormholeList = MapData.WormholeList;
        if (WormholeList == null) {
            WormholeList = { Coords: [], Teleports: [], ChatTriggers: [] };
        } else {
            if (ChatRoomData.Custom == undefined || ChatRoomData.Custom == null) {
                ChatRoomData.Custom = {};
            }
            ChatRoomData.Custom.WormholeList = WormholeList;
        }
        //remove wormhole data from the map data
        delete MapData.WormholeList;
	    // Loads the map and flags it to be refreshed
	    ChatRoomData.MapData = MapData;
	    ChatRoomMapViewUpdateFlag();
	    ChatRoomMapViewCalculatePerceptionMasks();
	    ChatRoomSendLocal(TextGet("MapPasteDone"));
    });
    //#9 Map prettify | Draw portal image over Coord or Teleport wormholes
    WH_API.hookFunction("DrawImageResize", 5, (args, next) => {
        const [Source, X, Y, Width, Height] = args;
        const Range = ChatRoomMapViewPerceptionRange;

        let SourcePath = "";
        if (typeof Source === "string") {
            SourcePath = Source;
        } else if (Source instanceof HTMLImageElement && typeof Source.src === "string") {
            SourcePath = Source.src;
        }

        if (SourcePath.startsWith(window.location.origin))
            SourcePath = SourcePath.replace(window.location.origin + "/", "");

        const isRelevant =
            SourcePath.includes("Screens/Online/ChatRoom/MapObject/") ||
            (SourcePath.includes("Screens/Online/ChatRoom/MapTile/") &&
                !SourcePath.includes("Screens/Online/ChatRoom/MapTile/WallEffect/"));

        // Always draw the base tile/object image
        DrawImageEx(Source, MainCanvas, X, Y, { Width, Height });

        // 🚫 Ignore stretched images (not 1:1 ratio) to avoid distorted portal overlays
        if (Width !== Height) return;

        if (Range > 0 && isRelevant) {
            const PX = Player?.MapData?.Pos?.X;
            const PY = Player?.MapData?.Pos?.Y;
            if (PX != null && PY != null) {
                // Calculate tile dimensions based on the original math
                const ViewportWidth = (Range * 2 + 1) * Width;
                const ViewportHeight = (Range * 2 + 1) * Height;
                const TileWidth = ViewportWidth / (Range * 2 + 1);
                const TileHeight = ViewportHeight / (Range * 2 + 1);
                
                const CenterOffsetX = Range * Width;
                const CenterOffsetY = Range * Height;

                const MapX = PX + Math.round((X - CenterOffsetX) / Width);
                const MapY = PY + Math.round((Y - CenterOffsetY) / Height);

                const Wormholes = ChatRoomData?.Custom?.WormholeList;
                if (!Wormholes) return;

                // Room Wormhole (Coord)
                if (
                    Wormholes?.Coords?.some(w => w.X === MapX && w.Y === MapY) &&
                    window.roomWormholeImageReady
                ) {
                    DrawImageEx(window.roomWormholeImage, MainCanvas, X, Y, { Width, Height });
                }

                // Teleports (source/target)
                for (const w of Wormholes?.Teleports || []) {
                    if (w.X === MapX && w.Y === MapY && window.startingPortalImageReady) {
                        DrawImageEx(window.startingPortalImage, MainCanvas, X, Y, { Width, Height });
                    }

                    if (w.TargetX === MapX && w.TargetY === MapY) {
                        if (w.backWards && window.backwardsPortalImageReady) {
                            DrawImageEx(window.backwardsPortalImage, MainCanvas, X, Y, { Width, Height });
                        } else if (!w.backWards && window.targetPortalImageReady) {
                            DrawImageEx(window.targetPortalImage, MainCanvas, X, Y, { Width, Height });
                        }
                    }
                }
            }
        }

        // No need to call next(), since we drew the tile image ourselves already
    });


    //command for registering a coordinate wormhole
    CommandCombine([{
        Tag: 'whcoord',
        Description: "[X] [Y] [RoomName]: Register a coordinate wormhole at X,Y that leads to RoomName",
        Action: args => {
            const splitArgs = args.split(" ");
            const roomName = splitArgs.slice(2).join(" "); // Handle room names with spaces

            if (splitArgs.length < 3) {
                ChatRoomSendLocal("Usage: /whcoord [X] [Y] [RoomName]");
                return;
            }

            const X = parseInt(splitArgs[0], 10);
            const Y = parseInt(splitArgs[1], 10);

            registerCoordWormhole(X, Y, roomName);
        }
    }]);

    //command for registering a chat trigger wormhole
    CommandCombine([{
        Tag: 'whchat',
        Description: "[TriggerWord] [RoomName]: Register a chat trigger that sends to RoomName when TriggerWord is said",
        Action: args => {
            const splitPoint = args.indexOf(" ");
            if (splitPoint === -1) {
                ChatRoomSendLocal("Usage: /whchat [TriggerWord] [RoomName]");
                return;
            }

            const triggerWord = args.substring(0, splitPoint);
            const roomName = args.substring(splitPoint + 1);

            registerChatTriggerWormhole(triggerWord, roomName);
        }
    }]);

    //command for registering a teleport wormhole
    CommandCombine([{
        Tag: 'whteleport',
        Description: "[X] [Y] [TargetX] [TargetY] [backwards?]: Register a teleport from X,Y to TargetX,TargetY. Optional 'true' for two-way",
        Action: args => {
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
            registerTeleportWormhole(X, Y, TargetX, TargetY, backWards);
        }
    }]);
    //command for toggling wormhole trigger bools
    CommandCombine([{
        Tag: 'whtrigger',
        Description: "[type] [true/false]: Toggle specific wormhole type. Types: coords, teleports, chat",
        Action: args => {
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
            // Check and fix boolean values
            validateWormholeTriggers();
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
    }]);
}

// Start initialization
initWait();
//------------------------------------------------------------
/*
Player.OnlineSharedSettings.WormholeTriggers = {
    TeleportsTrigger: bool,
    ChatTriggersTrigger: bool,
    CoordsTrigger: bool
}

ChatRoomData.Custom.WormholeList = {
    Coords: [
        { X: int, Y: int, RoomName: string }
    ],
    Teleports: [
        { X: int, Y: int, TargetX: int, TargetY: int, backWards: bool }
    ],
    ChatTriggers: [
        { TriggerWord: string, RoomName: string }
    ]
}
*/
//------------------------------------------------------------
// issues
// Room Chat options list is too quick, appears for too short period of time...

//Hook into ChatRoomAdminCustomization to draw an extra button with our custom image.
WH_API.hookFunction("ChatAdminRoomCustomizationRun", 4, (args, next) => {
    if (CurrentScreen == 'ChatAdminRoomCustomization') {
        DrawButton(1815, 75, 90, 90, "", "White", "https://i.ibb.co/XP4cXNk/Wormholes.png");
    }
    return next(args);
});
//Hook into Click handler of ChatAdminRoomCustomization
WH_API.hookFunction("ChatAdminRoomCustomizationClick", 0, (args, next) => {
        if (MouseIn(1815, 75, 90, 90)) {
            CommonSetScreen("Online", "Wormholes");
        }
    return next(args);
});

//------------------------------------------------------------
var WormholesBackground = "Sheet";

function WormholesRun() {
    // Set text alignment for our labels
    MainCanvas.textAlign = "left";
    
    // Draw the three lines
    DrawText("- Teleports:", 250, 150, "Black", "Gray");
    DrawText("- CoordWormholes:", 250, 200, "Black", "Gray");
    DrawText("- ChatTriggerWormholes:", 250, 250, "Black", "Gray");

    // Draw the exit button (keeping this part as is)
    MainCanvas.textAlign = "center";
    DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
}

function WormholesClick() {
	// When the user exits
	if (MouseIn(1815, 75, 90, 90)) WormholesExit();
}

function WormholesExit() {
    //WormholesUnload();
	CommonSetScreen("Online", "ChatAdminRoomCustomization");
}

function WormholesLoad() {
    //nothing so far
}

function WormholesUnload() {
    //nothing so far
}
