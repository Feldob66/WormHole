"use strict";
var Wormhole = (() => {
  var __defProp = Object.defineProperty;
  var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

  // src/Wormhole.ts
  var bcModSDK = (function() {
    "use strict";
    const o = "1.2.0";
    function e(o2) {
      alert("Mod ERROR:\n" + o2);
      const e2 = new Error(o2);
      throw console.error(e2), e2;
    }
    __name(e, "e");
    const t = new TextEncoder();
    function n(o2) {
      return !!o2 && "object" == typeof o2 && !Array.isArray(o2);
    }
    __name(n, "n");
    function r(o2) {
      const e2 = /* @__PURE__ */ new Set();
      return o2.filter(((o3) => !e2.has(o3) && e2.add(o3)));
    }
    __name(r, "r");
    const i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set();
    function c(o2) {
      a.has(o2) || (a.add(o2), console.warn(o2));
    }
    __name(c, "c");
    function s(o2) {
      const e2 = [], t2 = /* @__PURE__ */ new Map(), n2 = /* @__PURE__ */ new Set();
      for (const r3 of f.values()) {
        const i3 = r3.patching.get(o2.name);
        if (i3) {
          e2.push(...i3.hooks);
          for (const [e3, a2] of i3.patches.entries()) t2.has(e3) && t2.get(e3) !== a2 && c(`ModSDK: Mod '${r3.name}' is patching function ${o2.name} with same pattern that is already applied by different mod, but with different pattern:
Pattern:
${e3}
Patch1:
${t2.get(e3) || ""}
Patch2:
${a2}`), t2.set(e3, a2), n2.add(r3.name);
        }
      }
      e2.sort(((o3, e3) => e3.priority - o3.priority));
      const r2 = (function(o3, e3) {
        if (0 === e3.size) return o3;
        let t3 = o3.toString().replaceAll("\r\n", "\n");
        for (const [n3, r3] of e3.entries()) t3.includes(n3) || c(`ModSDK: Patching ${o3.name}: Patch ${n3} not applied`), t3 = t3.replaceAll(n3, r3);
        return (0, eval)(`(${t3})`);
      })(o2.original, t2);
      let i2 = /* @__PURE__ */ __name(function(e3) {
        var t3, i3;
        const a2 = null === (i3 = (t3 = m.errorReporterHooks).hookChainExit) || void 0 === i3 ? void 0 : i3.call(t3, o2.name, n2), c2 = r2.apply(this, e3);
        return null == a2 || a2(), c2;
      }, "i");
      for (let t3 = e2.length - 1; t3 >= 0; t3--) {
        const n3 = e2[t3], r3 = i2;
        i2 = /* @__PURE__ */ __name(function(e3) {
          var t4, i3;
          const a2 = null === (i3 = (t4 = m.errorReporterHooks).hookEnter) || void 0 === i3 ? void 0 : i3.call(t4, o2.name, n3.mod), c2 = n3.hook.apply(this, [e3, (o3) => {
            if (1 !== arguments.length || !Array.isArray(e3)) throw new Error(`Mod ${n3.mod} failed to call next hook: Expected args to be array, got ${typeof o3}`);
            return r3.call(this, o3);
          }]);
          return null == a2 || a2(), c2;
        }, "i");
      }
      return { hooks: e2, patches: t2, patchesSources: n2, enter: i2, final: r2 };
    }
    __name(s, "s");
    function l(o2, e2 = false) {
      let r2 = i.get(o2);
      if (r2) e2 && (r2.precomputed = s(r2));
      else {
        let e3 = window;
        const a2 = o2.split(".");
        for (let t2 = 0; t2 < a2.length - 1; t2++) if (e3 = e3[a2[t2]], !n(e3)) throw new Error(`ModSDK: Function ${o2} to be patched not found; ${a2.slice(0, t2 + 1).join(".")} is not object`);
        const c2 = e3[a2[a2.length - 1]];
        if ("function" != typeof c2) throw new Error(`ModSDK: Function ${o2} to be patched not found`);
        const l2 = (function(o3) {
          let e4 = -1;
          for (const n2 of t.encode(o3)) {
            let o4 = 255 & (e4 ^ n2);
            for (let e5 = 0; e5 < 8; e5++) o4 = 1 & o4 ? -306674912 ^ o4 >>> 1 : o4 >>> 1;
            e4 = e4 >>> 8 ^ o4;
          }
          return ((-1 ^ e4) >>> 0).toString(16).padStart(8, "0").toUpperCase();
        })(c2.toString().replaceAll("\r\n", "\n")), d2 = { name: o2, original: c2, originalHash: l2 };
        r2 = Object.assign(Object.assign({}, d2), { precomputed: s(d2), router: /* @__PURE__ */ __name(() => {
        }, "router"), context: e3, contextProperty: a2[a2.length - 1] }), r2.router = /* @__PURE__ */ (function(o3) {
          return function(...e4) {
            return o3.precomputed.enter.apply(this, [e4]);
          };
        })(r2), i.set(o2, r2), e3[r2.contextProperty] = r2.router;
      }
      return r2;
    }
    __name(l, "l");
    function d() {
      for (const o2 of i.values()) o2.precomputed = s(o2);
    }
    __name(d, "d");
    function p() {
      const o2 = /* @__PURE__ */ new Map();
      for (const [e2, t2] of i) o2.set(e2, { name: e2, original: t2.original, originalHash: t2.originalHash, sdkEntrypoint: t2.router, currentEntrypoint: t2.context[t2.contextProperty], hookedByMods: r(t2.precomputed.hooks.map(((o3) => o3.mod))), patchedByMods: Array.from(t2.precomputed.patchesSources) });
      return o2;
    }
    __name(p, "p");
    const f = /* @__PURE__ */ new Map();
    function u(o2) {
      f.get(o2.name) !== o2 && e(`Failed to unload mod '${o2.name}': Not registered`), f.delete(o2.name), o2.loaded = false, d();
    }
    __name(u, "u");
    function g(o2, t2) {
      o2 && "object" == typeof o2 || e("Failed to register mod: Expected info object, got " + typeof o2), "string" == typeof o2.name && o2.name || e("Failed to register mod: Expected name to be non-empty string, got " + typeof o2.name);
      let r2 = `'${o2.name}'`;
      "string" == typeof o2.fullName && o2.fullName || e(`Failed to register mod ${r2}: Expected fullName to be non-empty string, got ${typeof o2.fullName}`), r2 = `'${o2.fullName} (${o2.name})'`, "string" != typeof o2.version && e(`Failed to register mod ${r2}: Expected version to be string, got ${typeof o2.version}`), o2.repository || (o2.repository = void 0), void 0 !== o2.repository && "string" != typeof o2.repository && e(`Failed to register mod ${r2}: Expected repository to be undefined or string, got ${typeof o2.version}`), null == t2 && (t2 = {}), t2 && "object" == typeof t2 || e(`Failed to register mod ${r2}: Expected options to be undefined or object, got ${typeof t2}`);
      const i2 = true === t2.allowReplace, a2 = f.get(o2.name);
      a2 && (a2.allowReplace && i2 || e(`Refusing to load mod ${r2}: it is already loaded and doesn't allow being replaced.
Was the mod loaded multiple times?`), u(a2));
      const c2 = /* @__PURE__ */ __name((o3) => {
        let e2 = g2.patching.get(o3.name);
        return e2 || (e2 = { hooks: [], patches: /* @__PURE__ */ new Map() }, g2.patching.set(o3.name, e2)), e2;
      }, "c"), s2 = /* @__PURE__ */ __name((o3, t3) => (...n2) => {
        var i3, a3;
        const c3 = null === (a3 = (i3 = m.errorReporterHooks).apiEndpointEnter) || void 0 === a3 ? void 0 : a3.call(i3, o3, g2.name);
        g2.loaded || e(`Mod ${r2} attempted to call SDK function after being unloaded`);
        const s3 = t3(...n2);
        return null == c3 || c3(), s3;
      }, "s"), p2 = { unload: s2("unload", (() => u(g2))), hookFunction: s2("hookFunction", ((o3, t3, n2) => {
        "string" == typeof o3 && o3 || e(`Mod ${r2} failed to patch a function: Expected function name string, got ${typeof o3}`);
        const i3 = l(o3), a3 = c2(i3);
        "number" != typeof t3 && e(`Mod ${r2} failed to hook function '${o3}': Expected priority number, got ${typeof t3}`), "function" != typeof n2 && e(`Mod ${r2} failed to hook function '${o3}': Expected hook function, got ${typeof n2}`);
        const s3 = { mod: g2.name, priority: t3, hook: n2 };
        return a3.hooks.push(s3), d(), () => {
          const o4 = a3.hooks.indexOf(s3);
          o4 >= 0 && (a3.hooks.splice(o4, 1), d());
        };
      })), patchFunction: s2("patchFunction", ((o3, t3) => {
        "string" == typeof o3 && o3 || e(`Mod ${r2} failed to patch a function: Expected function name string, got ${typeof o3}`);
        const i3 = l(o3), a3 = c2(i3);
        n(t3) || e(`Mod ${r2} failed to patch function '${o3}': Expected patches object, got ${typeof t3}`);
        for (const [n2, i4] of Object.entries(t3)) "string" == typeof i4 ? a3.patches.set(n2, i4) : null === i4 ? a3.patches.delete(n2) : e(`Mod ${r2} failed to patch function '${o3}': Invalid format of patch '${n2}'`);
        d();
      })), removePatches: s2("removePatches", ((o3) => {
        "string" == typeof o3 && o3 || e(`Mod ${r2} failed to patch a function: Expected function name string, got ${typeof o3}`);
        const t3 = l(o3);
        c2(t3).patches.clear(), d();
      })), callOriginal: s2("callOriginal", ((o3, t3, n2) => {
        "string" == typeof o3 && o3 || e(`Mod ${r2} failed to call a function: Expected function name string, got ${typeof o3}`);
        const i3 = l(o3);
        return Array.isArray(t3) || e(`Mod ${r2} failed to call a function: Expected args array, got ${typeof t3}`), i3.original.apply(null != n2 ? n2 : globalThis, t3);
      })), getOriginalHash: s2("getOriginalHash", ((o3) => {
        "string" == typeof o3 && o3 || e(`Mod ${r2} failed to get hash: Expected function name string, got ${typeof o3}`);
        return l(o3).originalHash;
      })) }, g2 = { name: o2.name, fullName: o2.fullName, version: o2.version, repository: o2.repository, allowReplace: i2, api: p2, loaded: true, patching: /* @__PURE__ */ new Map() };
      return f.set(o2.name, g2), Object.freeze(p2);
    }
    __name(g, "g");
    function h() {
      const o2 = [];
      for (const e2 of f.values()) o2.push({ name: e2.name, fullName: e2.fullName, version: e2.version, repository: e2.repository });
      return o2;
    }
    __name(h, "h");
    let m;
    const y = void 0 === window.bcModSdk ? window.bcModSdk = (function() {
      const e2 = { version: o, apiVersion: 1, registerMod: g, getModsInfo: h, getPatchingInfo: p, errorReporterHooks: Object.seal({ apiEndpointEnter: null, hookEnter: null, hookChainExit: null }) };
      return m = e2, Object.freeze(e2);
    })() : (n(window.bcModSdk) || e("Failed to init Mod SDK: Name already in use"), 1 !== window.bcModSdk.apiVersion && e(`Failed to init Mod SDK: Different version already loaded ('1.2.0' vs '${window.bcModSdk.version}')`), window.bcModSdk.version !== o && alert(`Mod SDK warning: Loading different but compatible versions ('1.2.0' vs '${window.bcModSdk.version}')
One of mods you are using is using an old version of SDK. It will work for now but please inform author to update`), window.bcModSdk);
    return "undefined" != typeof exports && (Object.defineProperty(exports, "__esModule", { value: true }), exports.default = y), y;
  })();
  var WHver = "0.0.8";
  var WH_API = bcModSDK.registerMod({
    name: "WH",
    fullName: "WormHole",
    version: WHver,
    repository: "https://example.com/"
  });
  function initGlobalVars() {
    window.wormHoleSearch = false;
    window.teleportedByWormhole = false;
    window.fixedCustomSettings = false;
    window.changeDone = false;
    window.serverAnswered = true;
    window.oldRoomName = "";
    window.oldRoomSpace = void 0;
    window.targetedRoom = "";
    window.WHdebugMode = false;
  }
  __name(initGlobalVars, "initGlobalVars");
  initGlobalVars();
  var backwardsPortalImage = new Image();
  backwardsPortalImage.src = "https://raw.githubusercontent.com/Feldob66/WormHole/refs/heads/main/Wormholes.png";
  window.backwardsPortalImage = backwardsPortalImage;
  window.backwardsPortalImageReady = false;
  backwardsPortalImage.onload = () => window.backwardsPortalImageReady = true;
  var startingPortalImage = new Image();
  startingPortalImage.src = "https://raw.githubusercontent.com/Feldob66/WormHole/refs/heads/main/Wormholes.png";
  window.startingPortalImage = startingPortalImage;
  window.startingPortalImageReady = false;
  startingPortalImage.onload = () => window.startingPortalImageReady = true;
  var targetPortalImage = new Image();
  targetPortalImage.src = "https://raw.githubusercontent.com/Feldob66/WormHole/refs/heads/main/Wormholes.png";
  window.targetPortalImage = targetPortalImage;
  window.targetPortalImageReady = false;
  targetPortalImage.onload = () => window.targetPortalImageReady = true;
  var roomWormholeImage = new Image();
  roomWormholeImage.src = "https://raw.githubusercontent.com/Feldob66/WormHole/refs/heads/main/Wormholes.png";
  window.roomWormholeImage = roomWormholeImage;
  window.roomWormholeImageReady = false;
  roomWormholeImage.onload = () => window.roomWormholeImageReady = true;
  function WHdebugLog(message) {
    if (window.WHdebugMode) {
      console.log(message);
    }
  }
  __name(WHdebugLog, "WHdebugLog");
  function joinWormhole(roomName) {
    if ("" == roomName || !roomName) {
      return;
    }
    if (ChatRoomData?.Name) {
      ChatRoomSendLocal("Sending search request for room: " + roomName, 6600);
      window.targetedRoom = roomName;
      window.oldRoomName = ChatRoomData.Name;
      window.oldRoomSpace = ChatRoomData.Space;
      window.serverAnswered = false;
      window.wormHoleSearch = true;
      ServerSend("ChatRoomSearch", { Query: roomName.toUpperCase(), Language: "", Space: ChatRoomData.Space, Game: "", FullRooms: true, ShowLocked: true });
    } else if (window.oldRoomName != "" && ["", "X", "M"].includes(window.oldRoomSpace)) {
      ChatRoomSendLocal("Sending search request for room: " + roomName, 6600);
      window.targetedRoom = roomName;
      window.serverAnswered = false;
      window.wormHoleSearch = true;
      ServerSend("ChatRoomSearch", { Query: roomName.toUpperCase(), Language: "", Space: window.oldRoomSpace, Game: "", FullRooms: true, ShowLocked: true });
      window.oldRoomName = "";
      window.oldRoomSpace = void 0;
    }
  }
  __name(joinWormhole, "joinWormhole");
  function registerCoordWormhole(X, Y, RoomName) {
    if (!ChatRoomData?.Admin?.includes(Player.MemberNumber) || ChatRoomData.Name == RoomName) {
      if (!ChatRoomData?.Admin?.includes(Player.MemberNumber)) {
        ChatRoomSendLocal("You need to be an admin to register a wormhole.", 6600);
      } else {
        ChatRoomSendLocal("You can't register a wormhole with this room as the target.", 6600);
      }
      return;
    }
    if (!CommonIsInteger(X, 0, 39) || !CommonIsInteger(Y, 0, 39) || typeof RoomName !== "string" || RoomName.length > 20) {
      ChatRoomSendLocal("Invalid wormhole coordinates or room name.\nMake sure X and Y are between 0-39 and room name is under 20 characters.", 6600);
      return;
    }
    if (ChatRoomData.Custom == null || !ChatRoomData?.Custom?.WormholeList || !ChatRoomData?.Custom.WormholeList?.Coords) {
      initializeWormholeType("Coords");
      WHdebugLog("WormholeList.Coords initialized.");
    }
    if (ChatRoomData.Custom.WormholeList.Coords.find((e) => e.X === X && e.Y === Y && e.RoomName === RoomName)) {
      ChatRoomSendLocal("Wormhole already exists.", 6600);
      return;
    }
    const existingCoordIndex = ChatRoomData.Custom.WormholeList.Coords.findIndex((e) => e.X === X && e.Y === Y);
    if (existingCoordIndex !== -1) {
      if (ChatRoomData.Custom.WormholeList?.Coords?.[existingCoordIndex] && ChatRoomData.Custom.WormholeList?.Coords?.[existingCoordIndex]?.RoomName !== RoomName) {
        ChatRoomData.Custom.WormholeList.Coords[existingCoordIndex].RoomName = RoomName;
        const UpdatedRoom2 = ChatRoomGetSettings(ChatRoomData);
        UpdatedRoom2.Custom = ChatRoomData.Custom;
        ServerSend("ChatRoomAdmin", { MemberNumber: Player.ID, Room: UpdatedRoom2, Action: "Update" });
        ChatRoomSendLocal("Wormhole edited successfully.", 6600);
        return;
      }
    }
    ChatRoomData.Custom.WormholeList.Coords.push({ X, Y, RoomName });
    const UpdatedRoom = ChatRoomGetSettings(ChatRoomData);
    UpdatedRoom.Custom = ChatRoomData.Custom;
    ServerSend("ChatRoomAdmin", { MemberNumber: Player.ID, Room: UpdatedRoom, Action: "Update" });
    ChatRoomSendLocal("Wormhole registered successfully.", 6600);
  }
  __name(registerCoordWormhole, "registerCoordWormhole");
  function registerChatTriggerWormhole(TriggerWord, RoomName) {
    if (!ChatRoomData?.Admin?.includes(Player.MemberNumber) || ChatRoomData.Name == RoomName) {
      if (!ChatRoomData?.Admin?.includes(Player.MemberNumber)) {
        ChatRoomSendLocal("You need to be an admin to register a wormhole.", 6600);
      } else {
        ChatRoomSendLocal("You can't register a wormhole with this room as the target.", 6600);
      }
      return;
    }
    if (typeof TriggerWord !== "string" || typeof RoomName !== "string" || RoomName.length > 20) {
      ChatRoomSendLocal("Invalid wormhole room name.", 6600);
      return;
    }
    if (ChatRoomData.Custom == null || !ChatRoomData?.Custom?.WormholeList || !ChatRoomData?.Custom.WormholeList?.ChatTriggers) {
      initializeWormholeType("ChatTriggers");
      ChatRoomSendLocal("WormholeList.ChatTriggers initialized.", 6600);
    }
    const existingSourceIndex = ChatRoomData.Custom.WormholeList.ChatTriggers.findIndex((e) => e.TriggerWord === TriggerWord);
    if (existingSourceIndex !== -1 && ChatRoomData.Custom.WormholeList.ChatTriggers[existingSourceIndex] && ChatRoomData.Custom.WormholeList?.ChatTriggers?.[existingSourceIndex]?.RoomName !== RoomName) {
      ChatRoomData.Custom.WormholeList.ChatTriggers[existingSourceIndex].RoomName = RoomName;
      const UpdatedRoom2 = ChatRoomGetSettings(ChatRoomData);
      UpdatedRoom2.Custom = ChatRoomData.Custom;
      ServerSend("ChatRoomAdmin", { MemberNumber: Player.ID, Room: UpdatedRoom2, Action: "Update" });
      ChatRoomSendLocal("Wormhole edited successfully.", 6600);
      return;
    }
    ChatRoomData.Custom.WormholeList.ChatTriggers.push({ TriggerWord, RoomName });
    const UpdatedRoom = ChatRoomGetSettings(ChatRoomData);
    UpdatedRoom.Custom = ChatRoomData.Custom;
    ServerSend("ChatRoomAdmin", { MemberNumber: Player.ID, Room: UpdatedRoom, Action: "Update" });
    ChatRoomSendLocal("Wormhole registered.", 6600);
  }
  __name(registerChatTriggerWormhole, "registerChatTriggerWormhole");
  function registerTeleportWormhole(X, Y, TargetX, TargetY, backWards = false) {
    if (!ChatRoomData?.Admin?.includes(Player.MemberNumber)) {
      ChatRoomSendLocal("You need to be an admin to register a wormhole.", 6600);
      return;
    }
    if (!CommonIsInteger(X, 0, 39) || !CommonIsInteger(Y, 0, 39) || !CommonIsInteger(TargetX, 0, 39) || !CommonIsInteger(TargetY, 0, 39) || typeof backWards !== "boolean") {
      ChatRoomSendLocal("Invalid wormhole coordinates.\nMake sure X, Y, TargetX, TargetY are between 0-39 and backWards is a boolean.", 6600);
      return;
    }
    if (X === TargetX && Y === TargetY) {
      ChatRoomSendLocal("Source and target coordinates cannot be the same.", 6600);
      return;
    }
    if (!ChatRoomData.Custom?.WormholeList?.Teleports) {
      initializeWormholeType("Teleports");
      WHdebugLog("WormholeList.Teleports initialized.");
    }
    const Teleports = ChatRoomData.Custom.WormholeList.Teleports;
    if (Teleports.find((e) => e.X === X && e.Y === Y && e.TargetX === TargetX && e.TargetY === TargetY && e.backWards === backWards)) {
      ChatRoomSendLocal("This exact wormhole already exists.", 6600);
      return;
    }
    const TeleportsMinusOriginal = Teleports.filter((e) => e.X !== X || e.Y !== Y);
    if (backWards && TeleportsMinusOriginal.find((e) => e.TargetX === TargetX && e.TargetY === TargetY)) {
      ChatRoomSendLocal("Cannot make teleport backwards compatible when target is shared by multiple teleports.", 6600);
      return;
    }
    const existingSourceIndex = Teleports.findIndex((e) => e.X === X && e.Y === Y);
    if (existingSourceIndex !== -1 && Teleports[existingSourceIndex]) {
      let existingSourceEdited = false;
      if (Teleports?.[existingSourceIndex]?.TargetX !== TargetX || Teleports?.[existingSourceIndex]?.TargetY === TargetY) {
        Teleports[existingSourceIndex].TargetX = TargetX;
        Teleports[existingSourceIndex].TargetY = TargetY;
        existingSourceEdited = true;
      }
      if (Teleports[existingSourceIndex].backWards !== backWards) {
        Teleports[existingSourceIndex].backWards = backWards;
        existingSourceEdited = true;
      }
      if (existingSourceEdited) {
        const UpdatedRoom2 = ChatRoomGetSettings(ChatRoomData);
        UpdatedRoom2.Custom = ChatRoomData.Custom;
        ServerSend("ChatRoomAdmin", { MemberNumber: Player.ID, Room: UpdatedRoom2, Action: "Update" });
        ChatRoomSendLocal("Wormhole edited successfully.", 6600);
        return;
      }
    }
    Teleports.push({ X, Y, TargetX, TargetY, backWards });
    const UpdatedRoom = ChatRoomGetSettings(ChatRoomData);
    UpdatedRoom.Custom = ChatRoomData.Custom;
    ServerSend("ChatRoomAdmin", { MemberNumber: Player.ID, Room: UpdatedRoom, Action: "Update" });
    ChatRoomSendLocal("Wormhole registered successfully.", 6600);
  }
  __name(registerTeleportWormhole, "registerTeleportWormhole");
  function isValidTeleport(teleport) {
    if (!teleport) return false;
    return CommonIsInteger(teleport.X, 0, 39) && CommonIsInteger(teleport.Y, 0, 39) && CommonIsInteger(teleport.TargetX, 0, 39) && CommonIsInteger(teleport.TargetY, 0, 39) && typeof teleport.backWards === "boolean";
  }
  __name(isValidTeleport, "isValidTeleport");
  function isValidCoord(coord) {
    if (!coord) return false;
    return CommonIsInteger(coord.X, 0, 39) && CommonIsInteger(coord.Y, 0, 39) && typeof coord.RoomName === "string" && coord.RoomName.length <= 20;
  }
  __name(isValidCoord, "isValidCoord");
  function isValidChatTrigger(trigger) {
    if (!trigger) return false;
    return typeof trigger.TriggerWord === "string" && typeof trigger.RoomName === "string" && trigger.RoomName.length <= 20;
  }
  __name(isValidChatTrigger, "isValidChatTrigger");
  function initializeWormholeType(type) {
    if (!ChatRoomData || !ChatRoomData?.Admin?.includes(Player.MemberNumber)) return;
    window.changeDone = false;
    if (!ChatRoomData.Custom) {
      ChatRoomData.Custom = {
        WormholeList: {
          Coords: [],
          Teleports: [],
          ChatTriggers: []
        }
      };
      window.changeDone = true;
    }
    if (!ChatRoomData.Custom.WormholeList[type]) {
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
      ChatRoomSendLocal(`${type} initialized.`, 6600);
    }
  }
  __name(initializeWormholeType, "initializeWormholeType");
  function validateWormholeTriggers() {
    if (!Player.OnlineSharedSettings.WormholeTriggers) {
      Player.OnlineSharedSettings.WormholeTriggers = {
        TeleportsTrigger: true,
        ChatTriggersTrigger: true,
        CoordsTrigger: true
      };
      ServerAccountUpdate.QueueData({ OnlineSharedSettings: Player.OnlineSharedSettings }, true);
      return;
    }
    let needsUpdate = false;
    const wormHoleSettings = Player.OnlineSharedSettings.WormholeTriggers ?? {
      ChatTriggersTrigger: [],
      CoordsTrigger: [],
      TeleportsTrigger: []
    };
    if (typeof wormHoleSettings.TeleportsTrigger !== "boolean") {
      wormHoleSettings.TeleportsTrigger = false;
      needsUpdate = true;
    }
    if (typeof wormHoleSettings.ChatTriggersTrigger !== "boolean") {
      wormHoleSettings.ChatTriggersTrigger = false;
      needsUpdate = true;
    }
    if (typeof wormHoleSettings.CoordsTrigger !== "boolean") {
      wormHoleSettings.CoordsTrigger = false;
      needsUpdate = true;
    }
    if (needsUpdate) {
      Player.OnlineSharedSettings.WormholeTriggers = wormHoleSettings;
      ServerAccountUpdate.QueueData({ OnlineSharedSettings: Player.OnlineSharedSettings }, true);
    }
  }
  __name(validateWormholeTriggers, "validateWormholeTriggers");
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
  __name(initWait, "initWait");
  function init() {
    validateWormholeTriggers();
    WH_API.hookFunction("ChatSearchResponse", 4, (args, next) => {
      var data = args[0];
      if (typeof data !== "string") next(args);
      if (window.wormHoleSearch) {
        WHdebugLog(data);
        if (data == "RoomBanned") {
          joinWormhole(window.oldRoomName);
          setTimeout(() => {
            window.oldRoomName = "";
            ChatRoomSendLocal("You have been banned from the connected/linked room.", 6600);
          }, 6600);
          return;
        } else if (data == "RoomLocked") {
          WHdebugLog("Attempting to rejoin old room: " + window.oldRoomName);
          joinWormhole(window.oldRoomName);
          setTimeout(() => {
            window.oldRoomName = "";
            ChatRoomSendLocal("The room you tried to join is locked and you don't meet the join requirements.");
          }, 6600);
          return;
        } else if (data == "CannotFindRoom") {
          ChatRoomSendLocal("The room you are trying to join does not exist.", 6600);
        } else if (data == "JoinedRoom") {
          window.wormHoleSearch = false;
        } else if (data == "RoomKicked") {
          ChatRoomSendLocal("You have been kicked from the connected/linked room recently.", 6600);
        } else {
          WHdebugLog("Unhandled response for: (" + data + ")");
        }
        window.wormHoleSearch = false;
        return;
      } else {
        next(args);
      }
    });
    WH_API.hookFunction("ChatRoomMapViewMovementProcess", 4, (args, next) => {
      let posX, posY;
      if (Player.MapData?.Pos) {
        posX = Player.MapData.Pos.X;
        posY = Player.MapData.Pos.Y;
      }
      const ret = next(args);
      if (posX !== void 0 && posY !== void 0 && (posX !== Player.MapData?.Pos?.X || posY !== Player.MapData?.Pos?.Y)) {
        const movedToX = Player.MapData?.Pos?.X;
        const movedToY = Player.MapData?.Pos?.Y;
        WHdebugLog("Teleported to: " + movedToX + "," + movedToY);
        let coordMatch = false;
        let teleportMatch = false;
        if (ChatRoomData && ChatRoomData.Custom && ChatRoomData.Custom?.WormholeList && ChatRoomData.Custom?.WormholeList?.Coords && Player.OnlineSharedSettings.WormholeTriggers?.CoordsTrigger === true && !window.teleportedByWormhole) {
          const CoordWormholes = ChatRoomData.Custom.WormholeList.Coords;
          if (CoordWormholes?.length >= 1) {
            for (let W in CoordWormholes) {
              if (CoordWormholes[W] && movedToX == CoordWormholes[W].X && movedToY == CoordWormholes[W].Y) {
                joinWormhole(CoordWormholes[W].RoomName);
                coordMatch = true;
                break;
              }
            }
          }
        }
        if (ChatRoomData && ChatRoomData.Custom && ChatRoomData.Custom?.WormholeList && ChatRoomData.Custom?.WormholeList?.Teleports && Player?.OnlineSharedSettings?.WormholeTriggers?.TeleportsTrigger && !window.teleportedByWormhole) {
          const Teleports = ChatRoomData.Custom.WormholeList.Teleports;
          if (Teleports?.length >= 1) {
            for (let W in Teleports) {
              if (Teleports[W] && typeof Teleports[W].X === "number" && typeof Teleports[W].Y === "number" && movedToX === Teleports[W].X && movedToY === Teleports[W].Y) {
                window.teleportedByWormhole = true;
                if (Player.MapData && Player.MapData.Pos && typeof Teleports[W].TargetX === "number" && typeof Teleports[W].TargetY === "number") {
                  Player.MapData.Pos.X = Teleports[W].TargetX;
                  Player.MapData.Pos.Y = Teleports[W].TargetY;
                  ChatRoomMapViewUpdatePlayerFlag(-ChatRoomMapViewUpdatePlayerTime);
                  teleportMatch = true;
                  break;
                }
              } else if (Teleports[W] && Teleports[W].backWards && typeof Teleports[W].TargetX === "number" && typeof Teleports[W].TargetY === "number" && movedToX === Teleports[W].TargetX && movedToY === Teleports[W].TargetY) {
                window.teleportedByWormhole = true;
                if (Player.MapData && Player.MapData.Pos && typeof Teleports[W].X === "number" && typeof Teleports[W].Y === "number") {
                  Player.MapData.Pos.X = Teleports[W].X;
                  Player.MapData.Pos.Y = Teleports[W].Y;
                  ChatRoomMapViewUpdatePlayerFlag(-ChatRoomMapViewUpdatePlayerTime);
                  teleportMatch = true;
                  break;
                }
              }
            }
            if (!coordMatch && !teleportMatch && window.teleportedByWormhole) {
              window.teleportedByWormhole = false;
            }
          }
        }
      }
      return ret;
    });
    WH_API.hookFunction("ChatRoomMessage", 0, async (args, next) => {
      var data = args[0];
      let ignoredTypes = ["Hidden", "Status", "Action", "Activity", "LocalMessage"];
      if (data && data.Sender == Player.MemberNumber && !ignoredTypes.includes(data.Type)) {
        WHdebugLog(data);
        if (ChatRoomData && ChatRoomData.Custom?.WormholeList?.ChatTriggers && Player?.OnlineSharedSettings?.WormholeTriggers?.ChatTriggersTrigger) {
          const ChatTriggers = ChatRoomData.Custom.WormholeList.ChatTriggers;
          if (ChatTriggers.length < 1) {
            return next(args);
          }
          for (let W in ChatTriggers) {
            if (ChatTriggers[W] && typeof ChatTriggers[W].TriggerWord === "string" && data.Content.includes(ChatTriggers[W].TriggerWord)) {
              joinWormhole(ChatTriggers[W].RoomName);
              break;
            }
          }
        }
      }
      next(args);
    });
    WH_API.hookFunction("ChatRoomSync", 4, (args, next) => {
      const ret = next(args);
      if (!ChatRoomData) {
        return ret;
      }
      if (ChatRoomData?.Custom?.WormholeList?.ChatTriggers && Player.OnlineSharedSettings.WormholeTriggers?.ChatTriggersTrigger) {
        let ChatTriggers = ChatRoomData.Custom.WormholeList.ChatTriggers;
        if (ChatTriggers && ChatTriggers.length > 0) {
          let triggerList = "";
          for (let W in ChatTriggers) {
            if (ChatTriggers[W]) {
              triggerList += ChatTriggers[W].TriggerWord + " -> " + ChatTriggers[W].RoomName + "\n";
            }
          }
          setTimeout(() => {
            ChatRoomSendLocal("Chat triggers:\n" + triggerList, 6600);
          }, 360);
        }
      }
      return ret;
    });
    WH_API.hookFunction("ChatSearchResultResponse", 4, (args, next) => {
      const data = args[0];
      if (!window.serverAnswered) {
        ChatSearchResult = data;
        window.serverAnswered = true;
        WHdebugLog(ChatSearchResult);
        let targetRoom = ChatSearchResult.find((room) => room.Name.toUpperCase() == window.targetedRoom.toUpperCase());
        if (targetRoom) {
          WHdebugLog(targetRoom);
          if (targetRoom.MemberCount >= targetRoom.MemberLimit) {
            ChatRoomSendLocal("Target room is Full.");
            window.wormHoleSearch = false;
          } else {
            ChatRoomSendLocal("Joining target room.");
            window.wormHoleSearch = true;
            ChatRoomLeave();
            CommonSetScreen("Online", "ChatSearch");
            ServerSend("ChatRoomJoin", { Name: targetRoom.Name });
          }
        } else {
          ChatRoomSendLocal("Target room (" + window.targetedRoom + ") Not Found.");
          window.wormHoleSearch = false;
        }
      } else {
        return next(args);
      }
    });
    WH_API.hookFunction("ChatRoomMapViewUpdatePlayerFlag", 4, (args, next) => {
      const ret = next(args);
      if (window.teleportedByWormhole) {
        setTimeout(() => {
          window.teleportedByWormhole = false;
        }, 36);
      }
      return ret;
    });
    WH_API.hookFunction("CommonFetch", 4, (args, next) => {
      let request = args[0];
      const url = request instanceof Request ? request.url : request.toString();
      const reply = new Response("", { status: 200 });
      WHdebugLog(request);
      if (url.includes("Wormholes")) {
        return reply;
      }
      return next(args);
    });
    WH_API.hookFunction("ChatRoomMapViewCopy", 4, (args, next) => {
      if (ChatRoomData == null || ChatRoomData.MapData == null || ChatRoomData.MapData.Type == null || ChatRoomData.MapData.Type == "Never") {
        ChatRoomSendLocal(TextGet("MapCopyError"));
        return;
      }
      WHdebugLog(ChatRoomData.MapData);
      let expandedMapData = ChatRoomData.MapData;
      const wormholeList = ChatRoomData.Custom?.WormholeList ?? { Coords: [], Teleports: [], ChatTriggers: [] };
      WHdebugLog(wormholeList);
      let S = JSON.stringify(expandedMapData);
      WHdebugLog(S);
      S = LZString.compressToBase64(S);
      navigator.clipboard.writeText(S);
      ChatRoomSendLocal(TextGet("MapCopyDone"));
    });
    WH_API.hookFunction("ChatRoomMapViewPaste", 4, (args, next) => {
      let Param = args[0];
      if (typeof Param !== "string" || Param.length === 0) {
        ChatRoomSendLocal(TextGet("MapPasteError"));
        return;
      }
      if (!ChatRoomPlayerIsAdmin()) {
        ChatRoomSendLocal(TextGet("MapPasteAdmin"));
        return;
      }
      let DecompressedData = null;
      try {
        DecompressedData = LZString.decompressFromBase64(Param);
      } catch (err) {
        DecompressedData = null;
      }
      if (DecompressedData == null) {
        ChatRoomSendLocal(TextGet("MapPasteError"));
        return;
      }
      let MapData = null;
      try {
        MapData = JSON.parse(DecompressedData);
      } catch (err) {
        MapData = null;
      }
      if (MapData == null || MapData.Tiles == null) {
        ChatRoomSendLocal(TextGet("MapPasteError"));
        return;
      }
      let WormholeList = MapData.WormholeList;
      if (WormholeList == null) {
        WormholeList = { Coords: [], Teleports: [], ChatTriggers: [] };
      } else {
        if (ChatRoomData && (ChatRoomData.Custom == void 0 || ChatRoomData.Custom == null)) {
          ChatRoomData.Custom = {
            WormholeList: { Coords: [], Teleports: [], ChatTriggers: [] }
          };
        }
        if (ChatRoomData) {
          ChatRoomData.Custom.WormholeList = WormholeList;
        }
      }
      delete MapData.WormholeList;
      if (ChatRoomData) {
        ChatRoomData.MapData = MapData;
        ChatRoomMapViewUpdateFlag();
        ChatRoomMapViewCalculatePerceptionMasks();
        ChatRoomSendLocal(TextGet("MapPasteDone"));
      } else {
        ChatRoomSendLocal(TextGet("MapPasteError"));
      }
    });
    function WormholeDraw(mapX, mapY, x, y, width, height) {
      const Wormholes = ChatRoomData?.Custom?.WormholeList;
      if (!Wormholes) return;
      if (Wormholes?.Coords?.some((w) => w.X === mapX && w.Y === mapY) && window.roomWormholeImageReady) {
        if (window.roomWormholeImage) {
          DrawImageEx(window.roomWormholeImage, MainCanvas, x, y, { Width: width, Height: height });
        }
      }
      for (const w of Wormholes?.Teleports || []) {
        if (w.X === mapX && w.Y === mapY && window.startingPortalImageReady && window.startingPortalImage) {
          DrawImageEx(window.startingPortalImage, MainCanvas, x, y, { Width: width, Height: height });
        }
        if (w.TargetX === mapX && w.TargetY === mapY) {
          if (w.backWards && window.backwardsPortalImageReady && window.backwardsPortalImage) {
            DrawImageEx(window.backwardsPortalImage, MainCanvas, x, y, { Width: width, Height: height });
          } else if (!w.backWards && window.targetPortalImageReady && window.targetPortalImage) {
            DrawImageEx(window.targetPortalImage, MainCanvas, x, y, { Width: width, Height: height });
          }
        }
      }
    }
    __name(WormholeDraw, "WormholeDraw");
    window.WormholeDraw = WormholeDraw;
    WH_API.patchFunction("ChatRoomMapViewDrawGrid", {
      "// For each characters in the chat room (don't draw when there's fog)": `if (!Fog) WormholeDraw(X, Y, Math.floor(TileCanvasX), Math.floor(TileCanvasY), Math.ceil(TileWidth), Math.ceil(TileHeight));`
    });
    CommandCombine([{
      Tag: "whcoord",
      Description: "[X] [Y] [RoomName]: Register a coordinate wormhole at X,Y that leads to RoomName",
      Action: /* @__PURE__ */ __name((args) => {
        const splitArgs = args.split(" ");
        const roomName = splitArgs.slice(2).join(" ");
        if (splitArgs.length < 3) {
          ChatRoomSendLocal("Usage: /whcoord [X] [Y] [RoomName]");
          return;
        }
        const X = splitArgs[0] ? parseInt(splitArgs[0], 10) : 0;
        const Y = splitArgs[1] ? parseInt(splitArgs[1], 10) : 0;
        registerCoordWormhole(X, Y, roomName);
      }, "Action")
    }]);
    CommandCombine([{
      Tag: "whchat",
      Description: "[TriggerWord] [RoomName]: Register a chat trigger that sends to RoomName when TriggerWord is said",
      Action: /* @__PURE__ */ __name((args) => {
        const splitPoint = args.indexOf(" ");
        if (splitPoint === -1) {
          ChatRoomSendLocal("Usage: /whchat [TriggerWord] [RoomName]");
          return;
        }
        const triggerWord = args.substring(0, splitPoint);
        const roomName = args.substring(splitPoint + 1);
        registerChatTriggerWormhole(triggerWord, roomName);
      }, "Action")
    }]);
    CommandCombine([{
      Tag: "whteleport",
      Description: "[X] [Y] [TargetX] [TargetY] [backwards?]: Register a teleport from X,Y to TargetX,TargetY. Optional 'true' for two-way",
      Action: /* @__PURE__ */ __name((args) => {
        const splitArgs = args.split(" ");
        if (splitArgs.length < 4) {
          ChatRoomSendLocal("Usage: /whteleport [X] [Y] [TargetX] [TargetY] [backwards?]");
          return;
        }
        const X = parseInt(splitArgs[0] ?? "0", 10);
        const Y = parseInt(splitArgs[1] ?? "0", 10);
        const TargetX = parseInt(splitArgs[2] ?? "0", 10);
        const TargetY = parseInt(splitArgs[3] ?? "0", 10);
        const backWards = splitArgs[4] ? splitArgs[4].toLowerCase() === "true" : false;
        registerTeleportWormhole(X, Y, TargetX, TargetY, backWards);
      }, "Action")
    }]);
    CommandCombine([{
      Tag: "whtrigger",
      Description: "[type] [true/false]: Toggle specific wormhole type. Types: coords, teleports, chat",
      Action: /* @__PURE__ */ __name((args) => {
        const splitArgs = args.toLowerCase().split(" ");
        if (splitArgs.length !== 2) {
          ChatRoomSendLocal("Usage: /whtrigger [type] [true/false]\nTypes: coords, teleports, chat");
          return;
        }
        const type = splitArgs[0] ?? "";
        const state = splitArgs[1] === "true";
        if (!["coords", "teleports", "chat"].includes(type)) {
          ChatRoomSendLocal("Invalid type. Use: coords, teleports, or chat");
          return;
        }
        const triggerMap = {
          "coords": "CoordsTrigger",
          "teleports": "TeleportsTrigger",
          "chat": "ChatTriggersTrigger"
        };
        const trigger = triggerMap[type];
        if (Player.OnlineSharedSettings.WormholeTriggers?.[trigger]) {
          if (Player.OnlineSharedSettings.WormholeTriggers[trigger] === state) {
            ChatRoomSendLocal(`Wormholes for ${type} are already ${state ? "enabled" : "disabled"}.`);
            return;
          }
          Player.OnlineSharedSettings.WormholeTriggers[trigger] = state;
          ServerAccountUpdate.QueueData({ OnlineSharedSettings: Player.OnlineSharedSettings }, true);
          ChatRoomSendLocal(`Wormholes for ${type} ${state ? "enabled" : "disabled"}.`);
        }
      }, "Action")
    }]);
    CommandCombine([{
      Tag: "whremove",
      Description: "[type] [identifier]: Remove a wormhole. Type: coords, teleports, chat",
      Action: /* @__PURE__ */ __name((args) => {
        const splitArgs = args.split(" ");
        if (splitArgs.length < 2) {
          ChatRoomSendLocal("Usage: /whremove [type] [identifier]\nTypes: coords, teleports, chat\nIdentifier format depends on type:\ncoords: X Y\nteleports: X Y\nchat: triggerword");
          return;
        }
        const type = splitArgs[0]?.toLowerCase();
        if (type && !["coords", "teleports", "chat"].includes(type)) {
          ChatRoomSendLocal("Invalid type. Use: coords, teleports, or chat");
          return;
        }
        if (!ChatRoomData?.Admin?.includes(Player.MemberNumber)) {
          ChatRoomSendLocal("You need to be an admin to remove wormholes");
          return;
        }
        initializeWormholeType(type === "chat" ? "ChatTriggers" : type === "coords" ? "Coords" : "Teleports");
        window.fixedCustomSettings = false;
        switch (type) {
          case "coords": {
            if (splitArgs.length < 3) {
              ChatRoomSendLocal("For coords type, provide X and Y coordinates");
              return;
            }
            const X = splitArgs[1] ? parseInt(splitArgs[1], 10) : 0;
            const Y = splitArgs[2] ? parseInt(splitArgs[2], 10) : 0;
            let Coords = ChatRoomData?.Custom?.WormholeList?.Coords;
            if (!Coords) {
              ChatRoomSendLocal("No coordinate wormholes found", 6600);
              return;
            }
            for (let W in Coords) {
              if (!isValidCoord(Coords[W])) {
                delete Coords[W];
                window.fixedCustomSettings = true;
              }
            }
            const index = Coords.findIndex((e) => e.X === X && e.Y === Y);
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
            const X = splitArgs[1] ? parseInt(splitArgs[1], 10) : 0;
            const Y = splitArgs[2] ? parseInt(splitArgs[2], 10) : 0;
            let Teleports = ChatRoomData?.Custom?.WormholeList?.Teleports;
            if (!Teleports) {
              ChatRoomSendLocal("No teleport wormholes found");
              return;
            }
            for (let W in Teleports) {
              if (!isValidTeleport(Teleports[W])) {
                delete Teleports[W];
                window.fixedCustomSettings = true;
              }
            }
            const index = Teleports.findIndex((e) => e.X === X && e.Y === Y);
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
            for (let W in ChatTriggers) {
              if (!isValidChatTrigger(ChatTriggers[W])) {
                delete ChatTriggers[W];
                window.fixedCustomSettings = true;
              }
            }
            const index = ChatTriggers.findIndex((e) => e.TriggerWord === triggerWord);
            if (index === -1) {
              ChatRoomSendLocal(`No chat trigger found for "${triggerWord}"`);
              return;
            }
            ChatTriggers.splice(index, 1);
            break;
          }
        }
        const UpdatedRoom = ChatRoomGetSettings(ChatRoomData);
        UpdatedRoom.Custom = ChatRoomData.Custom;
        ServerSend("ChatRoomAdmin", { MemberNumber: Player.ID, Room: UpdatedRoom, Action: "Update" });
        if (window.fixedCustomSettings) {
          ChatRoomSendLocal("Invalid entries were removed during cleanup");
        }
        ChatRoomSendLocal("Wormhole removed successfully");
      }, "Action")
    }]);
    CommandCombine([{
      Tag: "wormholes",
      Description: "[type]: Lists wormholes. Optional type: coords, teleports, chat",
      Action: /* @__PURE__ */ __name((args) => {
        args = args.toLowerCase().trim();
        if (args && !["coords", "teleports", "chat"].includes(args)) {
          ChatRoomSendLocal("Invalid wormhole type. Use: coords, teleports, or chat", 6600);
          return;
        }
        let output = "";
        if (!args || args === "coords") {
          if (ChatRoomData?.Custom?.WormholeList?.Coords) {
            initializeWormholeType("Coords");
            let Coords = ChatRoomData.Custom.WormholeList.Coords;
            if (Coords.length > 0) {
              output += "Coordinate Wormholes:\n";
              for (let W in Coords) {
                if (Coords[W] && isValidCoord(Coords[W])) {
                  output += `(X: ${Coords[W].X},Y: ${Coords[W].Y}) -> ${Coords[W].RoomName}
`;
                }
              }
            }
          }
        }
        if (!args || args === "teleports") {
          if (ChatRoomData?.Custom?.WormholeList?.Teleports) {
            initializeWormholeType("Teleports");
            let Teleports = ChatRoomData.Custom.WormholeList.Teleports;
            if (Teleports.length > 0) {
              if (output) output += "\n";
              output += "Teleport Wormholes: (Two-way means, that it works backwards too.)\n";
              for (let W in Teleports) {
                const teleport = Teleports[W];
                if (teleport && isValidTeleport(teleport)) {
                  output += `(X: ${teleport.X},Y: ${teleport.Y}) -> (X: ${teleport.TargetX},Y: ${teleport.TargetY})${teleport.backWards ? " (Two-way)" : ""}
`;
                }
              }
            }
          }
        }
        if (!args || args === "chat") {
          if (ChatRoomData?.Custom?.WormholeList?.ChatTriggers) {
            initializeWormholeType("ChatTriggers");
            let ChatTriggers = ChatRoomData.Custom.WormholeList.ChatTriggers;
            if (ChatTriggers.length > 0) {
              if (output) output += "\n";
              output += "Chat Triggers:\n";
              for (let W in ChatTriggers) {
                if (ChatTriggers[W] && isValidChatTrigger(ChatTriggers[W])) {
                  output += `"Trigger phrase: ${ChatTriggers[W].TriggerWord}" -> ${ChatTriggers[W].RoomName}
`;
                }
              }
            }
          }
        }
        if (output !== "") {
          output = output.slice(0, -1);
          ChatRoomSendLocal(output);
        } else {
          ChatRoomSendLocal("No wormholes found" + (args ? ` of type: ${args}` : ""));
        }
      }, "Action")
    }]);
    CommandCombine([{
      Tag: "whhelp",
      Description: "[command]: Shows help for wormhole commands. Optionally specify a command for detailed help",
      Action: /* @__PURE__ */ __name((args) => {
        validateWormholeTriggers();
        let triggerStatus = "Current Trigger States:\n";
        triggerStatus += `Coordinate Wormholes: ${Player.OnlineSharedSettings.WormholeTriggers?.CoordsTrigger ? "Enabled" : "Disabled"}
`;
        triggerStatus += `Teleport Wormholes: ${Player.OnlineSharedSettings.WormholeTriggers?.TeleportsTrigger ? "Enabled" : "Disabled"}
`;
        triggerStatus += `Chat Triggers: ${Player.OnlineSharedSettings.WormholeTriggers?.ChatTriggersTrigger ? "Enabled" : "Disabled"}
`;
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
        const commandDescription = commands[args];
        if (commandDescription) {
          ChatRoomSendLocal(commandDescription);
        } else if (args) {
          ChatRoomSendLocal("Unknown command. Available commands: " + Object.keys(commands).join(", "));
        } else {
          let output = "Wormhole Commands:\n";
          Object.entries(commands).forEach(([cmd, desc]) => {
            output += `/${cmd}: ${desc.split("\n")?.[0]?.replace("Usage: /", "")}
`;
          });
          output += "\nFor detailed help on any command, use: /whhelp [command]\n";
          output += "\n" + triggerStatus;
          output = output.slice(0, -1);
          ChatRoomSendLocal(output);
        }
      }, "Action")
    }]);
  }
  __name(init, "init");
  initWait();
  WH_API.hookFunction("ChatAdminRoomCustomizationRun", 4, (args, next) => {
    if (CurrentScreen == "ChatAdminRoomCustomization") {
      DrawButton(1815, 75, 90, 90, "", "White", "https://i.ibb.co/XP4cXNk/Wormholes.png");
    }
    return next(args);
  });
  WH_API.hookFunction("ChatAdminRoomCustomizationClick", 0, (args, next) => {
    if (MouseIn(1815, 75, 90, 90)) {
      CommonSetScreen("Online", "Wormholes");
    }
    return next(args);
  });
  var WormholesBackground = "Sheet";
  window.WormholesBackground = WormholesBackground;
  function WormholesRun() {
    MainCanvas.textAlign = "left";
    DrawText("- Teleports:", 250, 150, "Black", "Gray");
    DrawText("- CoordWormholes:", 250, 200, "Black", "Gray");
    DrawText("- ChatTriggerWormholes:", 250, 250, "Black", "Gray");
    MainCanvas.textAlign = "center";
    DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
  }
  __name(WormholesRun, "WormholesRun");
  window.WormholesRun = WormholesRun;
  function WormholesClick() {
    if (MouseIn(1815, 75, 90, 90)) WormholesExit();
  }
  __name(WormholesClick, "WormholesClick");
  window.WormholesClick = WormholesClick;
  function WormholesExit() {
    CommonSetScreen("Online", "ChatAdminRoomCustomization");
  }
  __name(WormholesExit, "WormholesExit");
  window.WormholesExit = WormholesExit;
  function WormholesLoad() {
  }
  __name(WormholesLoad, "WormholesLoad");
  window.WormholesLoad = WormholesLoad;
  function WormholesUnload() {
  }
  __name(WormholesUnload, "WormholesUnload");
  window.WormholesUnload = WormholesUnload;
  function WormholesDraw() {
  }
  __name(WormholesDraw, "WormholesDraw");
  window.WormholesDraw = WormholesDraw;
})();
//# sourceMappingURL=wormhole.js.map
