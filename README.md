# Wormhole (v0.0.7)
A Bondage Club mod that adds teleportation capabilities between and within chat rooms.

## Installation
- [Click here to install the script](https://github.com/Feldob66/WormHole/raw/main/Wormhole.user.js)
- Or use this bookmark:
```js
javascript:(()=>{fetch('https://github.com/Feldob66/WormHole/raw/main/Wormhole.user.js').then(r=>r.text()).then(r=>eval(r));})()
```

## Features
Create and manage three types of wormholes:

1. **Room-to-Room Portals**  
   Link coordinates in one room to another room entirely.

2. **Intra-Room Teleports**  
   Create coordinate-based teleports within the same room, with optional two-way functionality.

3. **Chat Triggers**  
   Set up word/phrase-activated room teleportation.

## Commands
### Registration
- `/whcoord <x> <y> <roomName>` - Create coordinate-based room portal
- `/whteleport <x> <y> <targetX> <targetY> [backwards]` - Create intra-room teleport
- `/whchat <triggerWord> <roomName>` - Create chat trigger portal

### Management
- `/whtrigger <type> <true/false>` - Toggle specific wormhole type (coords/teleports/chat)
- `/whremove <type> <identifier>` - Remove a wormhole (type: coords/teleports/chat)
- `/wormholes [type]` - List all or specific type of wormholes
- `/whhelp [command]` - Show help menu or detailed command help

## Wormhole Types
| Type | Source | Target | Optional |
|------|---------|---------|-----------|
| Room-to-Room | X,Y coordinates | Room Name | - |
| Teleport | X,Y coordinates | Target X,Y | Backwards flag |
| ChatTrigger | Word/phrase | Room Name | - |

## Requirements
- Must be room admin to create/edit/remove wormholes
- Cannot create portals to current room
- Coordinates must be within 0-39 range
- Room names and trigger words limited to 20 characters
- Teleport restrictions:
  - Source and target coordinates cannot be the same
  - No overlapping coordinates for backwards-compatible teleports
  - Multiple one-way teleports can share target coordinates

## Notes
- All wormhole types can be toggled individually
- Settings persist across sessions
- Invalid wormholes are automatically removed when detected
- Automatic cleanup and validation of wormhole data
- Safe loading - initializes only after proper login
- Portal overlay indicators (planned feature)