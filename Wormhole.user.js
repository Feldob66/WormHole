// ==UserScript==
// @name Wormhole
// @namespace https://www.bondageprojects.com/
// @version 0.0.7
// @description Various teleportation functions
// @author Felix,Sin
// @match https://bondageprojects.elementfx.com/*
// @match https://www.bondageprojects.elementfx.com/*
// @match https://bondage-europe.com/*
// @match https://www.bondage-europe.com/*
// @match https://bondageprojects.com/*
// @match https://www.bondageprojects.com/*
// @icon  https://wce.netlify.app/icon.png
// @grant none
// @run-at document-end
// ==/UserScript==
setTimeout(() => {
    fetch(`https://raw.githubusercontent.com/Feldob66/WormHole/refs/heads/main/Wormhole.js?${Date.now()}`)
        .then(response => response.text())
        .then(scriptText => {
            let script = document.createElement("script");
            script.textContent = scriptText;
            document.head.appendChild(script);
        })
        .catch(error => console.error("Failed to load script:", error));
}, 10000);

